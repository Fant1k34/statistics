import { findQuizByParameters } from '../../../api/quiz-api'
import { Difficulty, QuizType } from '../../../types/quiz-types'
import { setQuizQuestions, setQuizStage } from '../../quiz-slice/quiz-slice'
import { setQuizStatusError, setQuizStatusSuccess } from '../chose-quiz-slice'

export const loadQuizesThunk = () => async (dispatch: any, getState: any) => {
    dispatch(setQuizStage('LoadingQuiz'));

    const { topic, difficulty } = getState().choseQuiz;

    findQuizByParameters(topic as QuizType, difficulty as Difficulty)
        .then((response) => {
            const data = response.data;
            dispatch(setQuizQuestions(data));
            dispatch(setQuizStage('Quiz'));
            dispatch(setQuizStatusSuccess());
        })
        .catch(() => {
            dispatch(setQuizStatusError());
            dispatch(setQuizStage('Settings'));
        });
}