import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    quizStage: 'Settings',
    questionNumber: 0,
    maximumQuestions: undefined,
    questions: [],
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuizStage: (state, { payload }) => {
            state.quizStage = payload
        },
        increaseQuestionNumber: (state) => {
            state.questionNumber += 1
        },
        resetQuestionNumber: (state) => {
            state.questionNumber = 0
        },
        setQuizQuestions: (state, { payload }) => {
            state.questions = payload
        },
    },
})

export const quizReducer = quizSlice.reducer
export const {
    setQuizStage,
    increaseQuestionNumber,
    resetQuestionNumber,
    setQuizQuestions,
} = quizSlice.actions
