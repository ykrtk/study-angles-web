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

    const getDialogStyle = (
        checkAnswerResponse: CheckAnswerResponse,
        isLoading: boolean, 
        isError: boolean
    ) => {
        if (isLoading || !checkAnswerResponse) {
            return null;
        }

        const color = 'common.white';
        let backgroundColor = '';
        if (isError) {
            backgroundColor = 'error.main';
        } else if (!checkAnswerResponse.isAnswerCorrect) {
            backgroundColor = 'warning.main';
        } else {
            backgroundColor = 'success.main'
        }

        return {
            fontSize: 'xx-large',
            color: color,
            backgroundColor: backgroundColor,
            padding: '20px'
        }
    };

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
    };

    // const getDialog = (checkAnswerResponse: CheckAnswerResponse) => {
    //     if (checkAnswerResponse) {
    //         return (
    //             <Dialog open={props.open} onClose={props.parentCloseHandler}> 
    //                 <DialogTitle sx={getDialogStyle(props.checkAnswerResponse, props.isLoading, false)}>
    //                     {getDialogTitle(props.checkAnswerResponse, props.isLoading, false)}
    //                 </DialogTitle>
    //             </Dialog>
    //         );
    //     } else {
    //         return null;
    //     }
    // };

    //return getDialog(props.checkAnswerResponse);

    return (
        <div>
            {props.checkAnswerResponse ? 
                <Dialog open={props.open} onClose={props.parentCloseHandler}>
                    <DialogTitle sx={getDialogStyle(props.checkAnswerResponse, props.isLoading, false)}>
                        {getDialogTitle(props.checkAnswerResponse, props.isLoading, false)}
                    </DialogTitle>
                </Dialog>
            : null}            
        </div>
    );
}
