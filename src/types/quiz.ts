// Quiz without answer
export type Quiz = {
    id: string;
    choices: number[];
};

export type CheckAnswerResult = {
    id: string;
    result: boolean;
};
  
export type ResponseError = {
    message: string;
};