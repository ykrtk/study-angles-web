// Quiz without answer
export type Quiz = {
    id: string;
    choices: number[];
};

export type CheckAnswerRequest = {
    id: string;
    answer: number;
};

export type CheckAnswerResponse = {
    id: string;
    isAnswerCorrect: boolean;
};

export type ResponseError = {
    message: string;
};