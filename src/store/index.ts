import { configureStore } from '@reduxjs/toolkit'
import { getRootReducer } from './get-root-reducer'

export const store = configureStore({
    reducer: getRootReducer(),
})
