import { NextApiResponse, NextApiRequest } from 'next'
import { CheckAnswerResult, ResponseError } from '@/types/quiz'
import { quizzes } from '../../../../../data/quizzes'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1kb',
    },
  },
};

export default function checkAnswerHandler(
  req: NextApiRequest,
  res: NextApiResponse<CheckAnswerResult | ResponseError>
) {
  // Check if request method is POST
  if (req.method !== 'POST') {
    res.status(405).send({message: 'Method Not Allowed'});
    return;
  }

  const { id, answer } = req.body;
  if (!id || typeof(answer) === 'undefined') {
    res.status(400).json({message: 'Bad Request'});
  }

  const quiz = quizzes.find((q) => q.id === id);
  return (quiz
    ? res.status(200).json({id: id, result: (quiz.answer === answer)})
    : res.status(404).json({message: `Quiz with id: ${id} not found`}));
};