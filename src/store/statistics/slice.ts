import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setStatisticsData: (state, { payload }: { payload: []}) => {
            state.data = payload;
        }
    },
})

export const statisticsReducer = statisticsSlice.reducer
export const {
    setStatisticsData
} = statisticsSlice.actions
