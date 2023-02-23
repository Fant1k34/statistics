import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    topic: null,
    difficulty: null,
    status: 'loading',
}

const choseQuizSlice = createSlice({
    name: 'choseQuiz',
    initialState,
    reducers: {
        setQuizTopic(state, { payload }) {
            state.topic = payload
        },
        setQuizDifficulty(state, { payload }) {
            state.difficulty = payload
        },
        setQuizStatusLoading(state) {
            state.status = 'loading'
        },
        setQuizStatusSuccess(state) {
            state.status = 'success'
        },
        setQuizStatusError(state) {
            state.status = 'error'
        },
    },
})

export const choseQuizReducer = choseQuizSlice.reducer
export const {
    setQuizTopic,
    setQuizDifficulty,
    setQuizStatusError,
    setQuizStatusSuccess,
    setQuizStatusLoading,
} = choseQuizSlice.actions
