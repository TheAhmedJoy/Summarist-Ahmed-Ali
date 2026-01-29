"use client"

import { FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { addDoc, collection, getFirestore, onSnapshot, query, where } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"

export const getCheckoutUrl = async (app: FirebaseApp, priceId: string): Promise<string> => {
    const auth = getAuth(app)
    const userId = auth.currentUser?.uid

    if (!userId)
        throw new Error("User is not authenticated")

    const db = getFirestore(app)

    const checkoutSessionRef = collection(
        db,
        "customers",
        userId,
        "checkout_sessions"
    )

    const docRef = await addDoc(checkoutSessionRef, {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
    })

    return new Promise<string>((resolve, reject) => {
        const unsubscribe = onSnapshot(docRef, (snap) => {
            const { error, url } = snap.data() as {
                error?: { message: string }
                url?: string
            }
            if (error) {
                unsubscribe()
                reject(new Error(`An error occurred: ${error.message}`))
            }
            if (url) {
                console.log("Stripe Checkout URL:", url)
                unsubscribe()
                resolve(url)
            }
        })
    })
}

export const getPremiumStatus = async (app: FirebaseApp) => {
    const auth = getAuth(app)
    const userId = auth.currentUser?.uid

    if (!userId) 
        throw new Error("User not logged in")

    const db = getFirestore(app)
    const subscriptionsRef = collection(db, "customers", userId, "subscriptions")

    const q = query(
        subscriptionsRef,
        where("status", "in", ["trialing", "active"])
    )

    return new Promise<boolean>((resolve, reject) => {
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                // In this implementation we only expect one active or trialing subscription to exist.
                console.log("Subscription snapshot", snapshot.docs.length)
                if (snapshot.docs.length === 0) {
                    console.log("No active or trialing subscriptions found")
                    resolve(false)
                } else {
                    console.log("Active or trialing subscription found")
                    resolve(true)
                }
                unsubscribe()
            },
            reject
        )
    })
}