import { NextApiResponse, NextApiRequest } from 'next'
import { Quiz } from '@/types/quiz'
import { quizzes } from '../../../../data/quizzes'

const quzzes_without_answer = quizzes.map(quiz => {
    const { answer, ...clone } = quiz;
    return clone;
});

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse<Quiz[]>
){    
    return res.status(200).json(quzzes_without_answer);
};