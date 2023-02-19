import styles from '@/styles/AngleQuiz.module.scss'
import Image from 'next/image'
import { CheckAnswerResult, Quiz, ResponseError } from '@/types/quiz'
import { ImageList, ImageListItem, ImageListItemBar, ListSubheader } from '@mui/material'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import useSWR from 'swr'
import { AngleQuizImage } from './AngleQuizImage'

const QUIZ_MAIN_IMG_WIDTH = 550;
const QUIZ_MAIN_IMG_HEIGHT = 424;
const GALLERY_IMG_WIDTH = 300;
const GALLERY_IMG_HEIGHT = 231;

type AngleQuizProps = {
  fontFamily: string;
};

const fetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();

    if (res.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};

const getQuizIdFromIndex = (index: number) : string => {
    return (index + 1).toString();
};

const getImageUrl = (id: string, width: number) : string => {
    const id_number = parseInt(id); // Make sure id is integer
    const path = `/images/quizimage${id_number.toString().padStart(3, '0')}.png`;
    const qparams = `?w=${width}&fit=crop&auto=format`; 
    return (path + qparams);
};

function useQuizzes() {
    const { data, error, isLoading, isValidating } = useSWR('/api/quiz/list', fetcher);

    return {
      quizzes: data,
      isLoading,
      isError: error
    }
};

export function AngleQuiz(props: AngleQuizProps) {
    const t = useTranslations('AngleQuiz');
    const [selectedIndex, setSelectedIndex] = useState(0);
    // const { query } = useRouter();

    // const { data, error, isLoading, isValidating } = useSWR('/api/quiz/list', fetcher);

    const { quizzes, isLoading, isError } = useQuizzes();

    if (isLoading) return (<div>{t('loadingData')}</div>);
    if (isError) return (<div>{t('errorLoadingData')}</div>);

    return (
        <div className={styles.quizcontainer}>
            <div className={styles.quizmain}>
                <h2 className={styles.quizheading}>{t('quizHeading')}</h2>
                <AngleQuizImage
                    selectedQuiz={quizzes.find((q: Quiz) => q.id === getQuizIdFromIndex(selectedIndex))}
                    imageUrl={`${getImageUrl(getQuizIdFromIndex(selectedIndex), QUIZ_MAIN_IMG_WIDTH)}`}
                    imageWidth={QUIZ_MAIN_IMG_WIDTH}
                    imageHeight={QUIZ_MAIN_IMG_HEIGHT}
                    fontFamily={props.fontFamily}
                />
            </div>
            <div className={styles.quizgallery}>
                <ImageList cols={1} 
                    sx={{ width: GALLERY_IMG_WIDTH + 2, height: GALLERY_IMG_HEIGHT * 3.6, marginBlock: 0 }}>
                    <ImageListItem key="SubHeader" cols={1}>
                        <ListSubheader component="div" className={styles.gallerysubheader} sx={{ fontFamily: props.fontFamily }}>
                            {t('gallerySubHeader')}
                        </ListSubheader>
                    </ImageListItem>
                    {quizzes.map((quiz: Quiz) => (
                        <ImageListItem key={quiz.id}>
                            <Image
                                src={`${getImageUrl(quiz.id, GALLERY_IMG_WIDTH)}`}
                                alt={`Image ${quiz.id}`}
                                width={GALLERY_IMG_WIDTH}
                                height={GALLERY_IMG_HEIGHT}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={quiz.id}
                                subtitle={''}
                                className={styles.imageitembar}
                                sx={{ fontFamily: props.fontFamily }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        </div>
    );
}