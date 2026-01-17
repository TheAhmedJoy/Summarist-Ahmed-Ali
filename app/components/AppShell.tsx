"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"

type AppShellProps = {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {

    const pathname = usePathname()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const exactRoutes = ["/for-you", "/library", "/settings"]
    const prefixRoutes = ["/book/", "/player"]

    const showSidebar =
        exactRoutes.includes(pathname) ||
        prefixRoutes.some((prefix) => pathname.startsWith(prefix))

    useEffect(() => {
        if (!showSidebar) return

        document.body.style.overflow = isSidebarOpen ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [isSidebarOpen, showSidebar])

    if (!showSidebar) return <>{children}</>

    return (
        <div className="appShell">
            {isSidebarOpen && (
                <button type="button" className="sidebarOverlay" onClick={() => setIsSidebarOpen(false)} />
            )}

            <Sidebar isOpen={isSidebarOpen} onCloseAction={() => setIsSidebarOpen(false)} />

            <button type="button" className="sidebarToggle" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
                ☰
            </button>

            <main className="appMain">
                {children}
            </main>
        </div>
    )
}