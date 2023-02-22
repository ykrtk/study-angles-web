import styles from '@/styles/AngleQuiz.module.scss';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    ListSubheader,
} from '@mui/material';
import { Quiz } from '@/types/quiz';
import { AngleQuizImage } from './AngleQuizImage';
import { fetcher } from '@/utils/ApiHelpers';

const QUIZ_MAIN_IMG_WIDTH = 550;
const QUIZ_MAIN_IMG_HEIGHT = 424;
const GALLERY_IMG_WIDTH = 300;
const GALLERY_IMG_HEIGHT = 231;
const INITIAL_QUIZ_ID = '1';

type AngleQuizProps = {
    fontFamily: string;
};

const getImageUrl = (id: string, width: number): string => {
    const id_number = parseInt(id); // Make sure id is integer
    const path = `/images/quizimage${id_number
        .toString()
        .padStart(3, '0')}.png`;
    const qparams = `?w=${width}&fit=crop&auto=format`;
    return path + qparams;
};

function useQuizzes() {
    const { data, error, isLoading, isValidating } = useSWR(
        '/api/quiz/list',
        fetcher
    );
    return {
        quizzes: data,
        isLoading,
        isError: error,
    };
}

export function AngleQuiz(props: AngleQuizProps) {
    const t = useTranslations('AngleQuiz');
    const [selectedQuizId, setSelectedQuizId] = useState(INITIAL_QUIZ_ID);
    const { quizzes, isLoading, isError } = useQuizzes();

    const handleImageListClick = useCallback(
        (e: React.MouseEvent<HTMLElement>, id: string) => {
            if (id) {
                setSelectedQuizId(id);
            }
        },
        []
    );

    if (isLoading) return <div>{t('loadingData')}</div>;
    if (isError) return <div>{t('errorLoadingData')}</div>;

    return (
        <div className={styles.quizcontainer}>
            <div className={styles.quizmain}>
                <h2 className={styles.quizheading}>{t('quizHeading')}</h2>
                <AngleQuizImage
                    selectedQuiz={quizzes.find(
                        (q: Quiz) => q.id === selectedQuizId
                    )}
                    imageUrl={`${getImageUrl(
                        selectedQuizId,
                        QUIZ_MAIN_IMG_WIDTH
                    )}`}
                    imageWidth={QUIZ_MAIN_IMG_WIDTH}
                    imageHeight={QUIZ_MAIN_IMG_HEIGHT}
                    fontFamily={props.fontFamily}
                />
            </div>
            <div className={styles.quizgallery}>
                <ImageList
                    cols={1}
                    className={styles.galleryimagelist}
                    sx={{
                        width: GALLERY_IMG_WIDTH + 2,
                        height: GALLERY_IMG_HEIGHT * 3.6,
                    }}
                >
                    <ImageListItem key="SubHeader" cols={1}>
                        <ListSubheader
                            component="div"
                            className={styles.gallerysubheader}
                            sx={{ fontFamily: props.fontFamily }}
                        >
                            {t('gallerySubHeader')}
                        </ListSubheader>
                    </ImageListItem>
                    {quizzes.map((quiz: Quiz) => (
                        <ImageListItem
                            key={quiz.id}
                            onClick={(e) => handleImageListClick(e, quiz.id)}
                        >
                            <Image
                                src={`${getImageUrl(
                                    quiz.id,
                                    GALLERY_IMG_WIDTH
                                )}`}
                                alt={`Image ${quiz.id}`}
                                width={GALLERY_IMG_WIDTH}
                                height={GALLERY_IMG_HEIGHT}
                                loading="lazy"
                                className={styles.galleryimage}
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
