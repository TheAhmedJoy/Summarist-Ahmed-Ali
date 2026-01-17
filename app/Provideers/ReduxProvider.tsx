"use client"

import { Provider } from "react-redux"
import { makeStore } from "../Redux/RedexStore"

const store = makeStore()

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}