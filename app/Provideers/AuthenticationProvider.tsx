"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/init"

type AuthContextValue = {
    user: User | null
    loading: boolean
    isPremium: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        if (!auth) {
            setLoading(false)
            return
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)

            if (!firebaseUser) {
                setIsPremium(false)
                setLoading(false)
                return
            }

            if (!db) {
                setLoading(false)
                return
            }

            const snap = await getDoc(doc(db, "users", firebaseUser.uid))
            const data = snap.exists() ? snap.data() : null

            console.log("AUTH CHECK → uid:", firebaseUser.uid)
            console.log("AUTH CHECK → Firestore doc exists:", snap.exists())
            console.log("AUTH CHECK → Firestore isPremium:", data?.isPremium)

            setIsPremium(Boolean(data?.isPremium))
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isPremium }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>")
    }
    return ctx
}