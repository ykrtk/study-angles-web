import styles from '@/styles/AngleQuizImage.module.scss'
// import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useTranslations } from 'next-intl';
import Image from 'next/image'
import { Quiz } from '@/types/quiz';
import { Button } from '@mui/material';

type AngleQuizImageProps = {
    selectedQuiz: Quiz;
    imageUrl: string,
    imageWidth: number,
    imageHeight: number,
    fontFamily: string;
};

export function AngleQuizImage(props: AngleQuizImageProps) {
    const t = useTranslations('AngleQuizImage');

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
                <Button className={styles.checkanswerbutton} variant="contained">
                    {t('checkAnswerButtonLabel')}
                </Button>                            
            </div>
        </div>
    );
}