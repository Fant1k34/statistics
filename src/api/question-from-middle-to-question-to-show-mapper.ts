import { QuestionFromMiddle, QuestionToShow } from '../types/question-type'

export const questionFromMiddleToQuestionToShowMapper: (
    question: QuestionFromMiddle
) => QuestionToShow = (question) => {
    const correctAnswers: QuestionToShow['correctAnswers'] = {}
    for (const property in question.correct_answers) {
        correctAnswers[property] = question.correct_answers[property] === 'true'
    }

    return {
        ...question,
        multipleCorrectAnswers: question.multiple_correct_answers === 'true',
        correctAnswers,
    }
}
