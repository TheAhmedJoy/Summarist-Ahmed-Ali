
"use client"

import { useRef } from "react"
import { Book } from "@/util/API"
import BookCard from "./BookCard"
import styles from "./styles/BookCarousel.module.css"

interface BookCarouselProps {
    books: Book[]
    loading?: boolean
}

const SCROLL_AMOUNT = 320

export default function BookCarousel({ books, loading }: BookCarouselProps) {
    
    const trackRef = useRef<HTMLDivElement | null>(null)

    const scroll = (direction: "left" | "right") => {
        if (!trackRef.current) return
        const amount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT
        trackRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }

    const skeletons = Array.from({ length: 7 })

    return (
        <div className={styles.carousel}>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} type="button" onClick={() => scroll("left")}>
                ‹
            </button>

            <div ref={trackRef} className={styles.track}>
                {loading
                    ? skeletons.map((_, index) => (
                        <div key={index} className={styles.skeletonCard} />
                    ))
                    : books.map((book) => (
                        <div key={book.id} className={styles.slide}>
                            <BookCard book={book} />
                        </div>
                    ))}
            </div>

            <button className={`${styles.arrow} ${styles.arrowRight}`} type="button" onClick={() => scroll("right")}>
                ›
            </button>
        </div>
    )
}
