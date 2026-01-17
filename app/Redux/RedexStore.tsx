
import { configureStore } from '@reduxjs/toolkit'
import authModalReducer from "./AuthenticationModalSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            authModal: authModalReducer
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']