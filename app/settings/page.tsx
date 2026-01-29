"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useAuth } from "../Provideers/AuthenticationProvider"
import { openLogin } from "../Redux/AuthenticationModalSlice"
import { getPremiumStatus } from "@/util/Stripe"
import { app } from "@/firebase/init"
import styles from "../components/styles/Settings.module.css"

export default function SettingsPage() {
    
    const { user, loading } = useAuth()

    const [premiumStatus, setPremiumStatus] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        const checkPremium = async () => {
            const userPremiumStatus = user ? await getPremiumStatus(app) : false
            setPremiumStatus(userPremiumStatus)
        }
        checkPremium()
    }, [app, user?.uid])

    if (loading)
        return null

    if (!user) {
        return (
            <div className={styles.settings}>
                <h1 className={styles.title}>
                    Settings
                </h1>
                <div className={styles.loginCard}>
                    <img className={styles.loginImage} src="/assets/login.png" alt="Login required" />
                    <div className={styles.loginText}>
                        Log in to your account to see your details.
                    </div>
                    <button className={styles.loginBtn} type="button" onClick={() => dispatch(openLogin())}>
                        Login
                    </button>
                </div>
            </div>
        )
    }

    const planLabel = premiumStatus ? "Premium" : "Basic"

    return (
        <div className={styles.settings}>
            <h1 className={styles.title}>
                Settings
            </h1>
            <div className={styles.card}>
                <div className={styles.sectionTitle}>
                    Your Subscription plan
                </div>
                {!premiumStatus ?
                    (
                        <>
                            <div className={styles.value}>{planLabel}</div>
                            <hr className={styles.divider} />
                            <Link href="/choose-plan">
                                <button className={styles.upgradeBtn}>
                                    Upgrade to Premium
                                </button>
                            </Link>
                        </>
                    ) : (
                        <div className={styles.value}>
                            {planLabel}
                        </div>
                    )}
                <hr className={styles.divider} />
                <div className={styles.sectionTitle}>
                    Email
                </div>
                <div className={styles.value}>
                    {user.email ?? "No email found"}
                </div>
            </div>
        </div>
    )
}