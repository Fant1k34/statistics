import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    topic: null,
    difficulty: null,
    status: 'loading',
    grade: null,
    name: 'Данных нет',
    criteria: [],
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
        setQuizInfo(state, { payload }) {
            state.grade = payload.grade;
            state.name = payload.name;
            state.criteria = payload.criteria;
        }
    },
})

export const choseQuizReducer = choseQuizSlice.reducer
export const {
    setQuizTopic,
    setQuizDifficulty,
    setQuizStatusError,
    setQuizStatusSuccess,
    setQuizStatusLoading,
    setQuizInfo
} = choseQuizSlice.actions
