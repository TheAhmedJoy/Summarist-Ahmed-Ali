import { createSlice } from "@reduxjs/toolkit"

interface AuthModalState {
    isOpen: boolean,
    mode: "login" | "register"
}

const initialState: AuthModalState = {
    isOpen: false,
    mode: "login"
}

const authModalSlice = createSlice({
    name: "authModal",
    initialState,
    reducers: {
        openLogin: (state) => {
            state.isOpen = true
            state.mode = "login"
        },
        openRegister: (state) => {
            state.isOpen = true
            state.mode = "register"
        },
        closeModal: (state) => {
            state.isOpen = false
        }
    }
})

export const { openLogin, openRegister, closeModal } = authModalSlice.actions

export default authModalSlice.reducer