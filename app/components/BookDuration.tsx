"use client"

import { useEffect, useState } from "react"
import { getBookDuration } from "@/util/API"

function formatBookDuration(totalSeconds: number) {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) 
        return "00:00"

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export default function BookDuration({ audioLink }: { audioLink?: string | null }) {
    const [label, setLabel] = useState("00:00")

    useEffect(() => {
        let cancelled = false

        async function run() {
            if (!audioLink) return setLabel("00:00")

            try {
                const seconds = await getBookDuration(audioLink)
                if (!cancelled) setLabel(formatBookDuration(seconds))
            } catch {
                if (!cancelled) setLabel("00:00")
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [audioLink])

    return (
        <>
            {label}
        </>
    )
}