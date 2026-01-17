"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { searchBooks, type SearchBook } from "../../util/API"

export default function SearchBar() {
    
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchBook[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        const q = query.trim()

        if (!q) {
            abortRef.current?.abort()
            setResults([])
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        const timeoutId = window.setTimeout(async () => {
            abortRef.current?.abort()
            const controller = new AbortController()
            abortRef.current = controller

            try {
                const data = await searchBooks(q, controller.signal)
                setResults(Array.isArray(data) ? data : [])
            } catch (e: any) {
                if (e?.name !== "AbortError") {
                    console.error("Search failed:", e)
                    setResults([])
                }
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => window.clearTimeout(timeoutId)
    }, [query])

    const showDropdown = query.trim().length > 0

    return (
        <div className="search__background">
            <div className="search__wrapper">
                <input className="nav__search--input" value={query} placeholder="Search for books" onChange={(e) => setQuery(e.target.value)} />
                {showDropdown &&
                    (
                        <div className="search__books--wrapper">
                            {isLoading ? (
                                <div className="search__empty">Loading...</div>
                            ) : results.length === 0 ? (
                                <div className="search__empty">No books found</div>
                            ) : (
                                results.map((book) => (
                                    <Link className="search__book--link" href={`/book/${book.id}`}
                                        onClick={() => {
                                            setQuery("")
                                            setResults([])
                                        }}
                                        key={book.id}>
                                        {"audioLink" in book && (book as any).audioLink ? (
                                            <audio src={(book as any).audioLink as string} />
                                        ) : null}
                                        <figure className="book__image--wrapper">
                                            <img className="book__image" src={book.imageLink} alt={book.title} />
                                        </figure>

                                        <div>
                                            <div className="search__book--title">{book.title}</div>
                                            <div className="search__book--author">{book.author}</div>

                                            {"duration" in book && (book as any).duration ? (
                                                <div className="search__book--duration">
                                                    <div className="recommended__book--details">
                                                        <div className="recommended__book--details-icon">
                                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                                                                <path d="M13 7h-2v6h6v-2h-4z"></path>
                                                            </svg>
                                                        </div>
                                                        <div className="recommended__book--details-text">
                                                            {(book as any).duration as string}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
            </div>
        </div>
    )
}