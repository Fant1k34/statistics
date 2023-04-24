import { combineReducers } from '@reduxjs/toolkit'
import { quizReducer } from './quiz-slice/quiz-slice'
import { choseQuizReducer } from './chose-quiz-slice/chose-quiz-slice'
import { statisticsReducer } from './statistics/slice'

export const getRootReducer = () =>
    combineReducers({
        quiz: quizReducer,
        choseQuiz: choseQuizReducer,
        statistics: statisticsReducer,
    })
