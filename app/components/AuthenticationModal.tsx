"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "..//Redux/RedexStore"
import { closeModal, openRegister, openLogin } from "..//Redux/AuthenticationModalSlice"
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, googleProvider } from "../../firebase/init"
import { signInAnonymously } from "firebase/auth"
import GoogleLogo from "../../public/google.png"


export default function AuthModal() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const dispatch = useDispatch()

    const authModal = useSelector((state: RootState) => state.authModal)

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)

            dispatch(closeModal())
            router.push("/for-you")
        } catch (error) {
            console.error("Google auth error:", error)
        }
    }

    const handleGuestLogin = async () => {
        try {
            const result = await signInAnonymously(auth)

            console.log("Guest login success:", result.user)

            dispatch(closeModal())
            router.push("/for-you")
        } catch (err) {
            console.error("Guest login error:", err)
        }
    }

    const handleEmailLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (authModal.mode !== "login") return

        if (!email || !password) {
            setError("Please enter email and password.")
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            const cred = await signInWithEmailAndPassword(auth, email, password)

            dispatch(closeModal())
            router.push("/for-you")
        } catch (err: any) {
            setError(err?.message ?? "Login failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEmailSignup = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        if (authModal.mode !== "register") return

        if (!email || !password) {
            setError("Please enter email and password.")
            return
        }

        try {
            setSubmitting(true)
            setError(null)

            const cred = await createUserWithEmailAndPassword(auth, email, password)

            dispatch(closeModal())
            router.push("/for-you")
        } catch (err: any) {
            setError(err?.message ?? "Sign up failed. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (authModal.isOpen === false) {
        return null
    }
    return (
        <div className="auth__overlay">
            {authModal.isOpen && (
                <div className="auth__wrapper">
                    <div className="auth">
                        <div className="auth__content">
                            <div className="auth__title">
                                {authModal.mode === "login" ? "Login to Summarist" : "Create your account"}
                            </div>
                            {authModal.mode === "login" && (
                                <button className="btn guest__btn--wrapper" onClick={handleGuestLogin} >
                                    <figure className="google__icon--mask guest__icon--mask">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                                        </svg>
                                    </figure>
                                    <div>Login as a Guest</div>
                                </button>
                            )}
                            {
                                authModal.mode === "login" && (
                                    <div className="auth__separator">
                                        <span className="auth__separator--text">or</span>
                                    </div>
                                )
                            }
                            <button className="btn google__btn--wrapper" onClick={handleGoogleAuth}>
                                <figure className="google__icon--mask">
                                    <Image src={GoogleLogo} alt="Google Logo"></Image>
                                </figure>
                                <div>
                                    {
                                        authModal.mode === "login"
                                            ? "Login with Google"
                                            : "Signup with Google"
                                    }
                                </div>
                            </button>
                            <div className="auth__separator">
                                <span className="auth__separator--text">or</span>
                            </div>

                            <form className="auth__main--form">
                                <input className="auth__main--input" type="text" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input className="auth__main--input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <button className="auth__btn" onClick={authModal.mode === "login" ? handleEmailLogin : handleEmailSignup} disabled={submitting}>
                                    {
                                        submitting && authModal.mode === "login"
                                            ? "Logging in..."
                                            : authModal.mode === "login"
                                                ? "Login"
                                                : "Sign up"
                                    }
                                </button>
                                {error && <p className="auth__error">{error}</p>}
                            </form>
                        </div>
                        {
                            authModal.mode === "login" && (
                                <div className="auth__forgot--password">
                                    Forgot your password?
                                </div>
                            )
                        }
                        {
                            authModal.mode === "login" ? (
                                <button className="auth__switch--btn" onClick={() => dispatch(openRegister())}>
                                    Don't have an account?
                                </button>
                            ) : (
                                <button className="auth__switch--btn" onClick={() => dispatch(openLogin())}>
                                    Already have an account?
                                </button>
                            )
                        }
                        <div className="auth__close--btn" onClick={() => dispatch(closeModal())}>
                            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                                    fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}