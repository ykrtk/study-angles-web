import { useTranslations } from 'next-intl';
import { Dialog, DialogTitle } from '@mui/material';
import { CheckAnswerResponse } from '@/types/quiz';


type CheckAnswerResultDialogProps = {
    open: boolean;
    isLoading: boolean;
    checkAnswerResponse: CheckAnswerResponse;
    parentCloseHandler: (() => void);
};

export function CheckAnswerResultDialog(props: CheckAnswerResultDialogProps) {
    const t = useTranslations('CheckAnswerResultDialog');

    const getDialogTitle = (
        checkAnswerResponse: CheckAnswerResponse,
        isLoading: boolean, 
        isError: boolean
    ) : string => {
        if (isLoading || !checkAnswerResponse) {
            return t('loadingData');
        }
        if (isError) {
            return t('errorLoadingData');
        }
        if (checkAnswerResponse.isAnswerCorrect) {
            return t('answerCorrect');
        }
        return t('answerIncorrect');
    }

    return (
        <Dialog open={props.open} onClose={props.parentCloseHandler}> 
            <DialogTitle>
                {getDialogTitle(props.checkAnswerResponse, props.isLoading, false)}
            </DialogTitle>
        </Dialog>
    );
}
