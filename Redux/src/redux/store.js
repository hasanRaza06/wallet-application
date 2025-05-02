import { configureStore } from '@reduxjs/toolkit'
import mainSlice from "./slice"

export const store = configureStore({
    reducer: {
        counter:mainSlice
    },
})