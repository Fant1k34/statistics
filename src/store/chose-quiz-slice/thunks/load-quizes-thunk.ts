import { findQuizByParameters } from '../../../api/quiz-api'
import { Position, Grade } from '../../../types/quiz-types'
import { setQuizQuestions, setQuizStage } from '../../quiz-slice/quiz-slice'
import { setQuizStatusError, setQuizInfo, setQuizStatusSuccess } from '../chose-quiz-slice'

export const loadQuizesThunk = () => async (dispatch: any, getState: any) => {
    dispatch(setQuizStage('LoadingQuiz'));

    const { topic, difficulty } = getState().choseQuiz;

    findQuizByParameters(topic as Position, difficulty as Grade)
        .then((response) => {
            const data = response.data.questions;
            dispatch(setQuizQuestions(data));
            dispatch(setQuizInfo({ grade: response.data.grade, name: response.data.name, criteria: response.data.criteria }))
            dispatch(setQuizStage('Quiz'));
            dispatch(setQuizStatusSuccess());
        })
        .catch(() => {
            dispatch(setQuizStatusError());
            dispatch(setQuizStage('Settings'));
        });
}