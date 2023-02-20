import styles from '@/styles/AngleQuizImage.module.scss'
import { useCallback, useRef, useState } from 'react';
import axios from 'axios'
import { useTranslations } from 'next-intl';
import Image from 'next/image'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';

import { CheckAnswerRequest, CheckAnswerResponse, Quiz } from '@/types/quiz';
import { CheckAnswerResultDialog } from './CheckAnswerResultDialog';

type AngleQuizImageProps = {
    selectedQuiz: Quiz;
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
    fontFamily: string;
};

export function AngleQuizImage(props: AngleQuizImageProps) {
    const t = useTranslations('AngleQuizImage');
    const answerRef = useRef(0);

    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ checkAnswerResult, setCheckAnswerResult ] = useState<CheckAnswerResponse | null>(null);

    const checkAnswer = useCallback((id: string) => {
        setIsLoading(true);
        const requestBody : CheckAnswerRequest = {
            id: id,
            answer: answerRef.current
        };
        axios.post(`/api/quiz/check/${id}`, requestBody)
        .then((response) => {
            setCheckAnswerResult(response.data as CheckAnswerResponse);
        });
        setIsLoading(false);
    }, []);

    const handleRadioGroupChange = useCallback((e : React.ChangeEvent<HTMLInputElement>, value : string) => {
        const parsedAnswer = parseInt(value);
        answerRef.current = parsedAnswer;
    }, []);

    const handleDialogOpen = useCallback((id: string) => {
        checkAnswer(id);
        setIsDialogOpen(true);
    }, [checkAnswer]);
    
    const handleDialogClose = useCallback(() => {
        setIsDialogOpen(false);
        setCheckAnswerResult(null);
    }, []);

    return (
        <div className={styles.quizimagecontainer}>
            <Image
                className={styles.quizimage}
                src={props.imageUrl}
                alt={`Image ${props.selectedQuiz.id}`}
                width={props.imageWidth}
                height={props.imageHeight}
                loading="lazy"
            />
            <FormControl>
                <FormLabel
                    id="demo-row-radio-buttons-group-label"
                    className={styles.radiobuttongrouplabel}
                >
                    {t('radioButtonGroupLabel')}
                </FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    className={styles.radiobuttongroup}
                    onChange={(e, value) => handleRadioGroupChange(e, value)}
                >
                    {props.selectedQuiz.choices.map((choice: number) => (
                        <FormControlLabel
                            key={choice}
                            value={choice} 
                            control={<Radio />} 
                            label={t('radioButtonLabel', {degree: choice})}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            <div className={styles.checkansbuttoncontainer}>
                <Button
                    variant="contained"
                    className={styles.checkanswerbutton}
                    onClick={(e) => handleDialogOpen(props.selectedQuiz.id)}
                >
                    {t('checkAnswerButtonLabel')}
                </Button>
            </div>
            <CheckAnswerResultDialog
                open={isDialogOpen}
                isLoading={isLoading}
                checkAnswerResponse={checkAnswerResult as CheckAnswerResponse}
                parentCloseHandler={handleDialogClose}
            />
        </div>
    );
}