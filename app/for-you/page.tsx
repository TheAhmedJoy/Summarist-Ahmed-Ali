"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getRecommendedBooks, getSelectedBooks, getSuggestedBooks } from "../../util/API"
import type { Book } from "../../util/API"
import BookCarousel from "../components/BookCarousel"
import styles from "./page.module.css"

export default function ForYou() {

  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [recommendedLoading, setRecommendedLoading] = useState(true)
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([])
  const [suggestedLoading, setSuggestedLoading] = useState(true)
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [selectedLoading, setSelectedLoading] = useState(true)

  const selectedBook = !selectedLoading && selectedBooks.length > 0 ? selectedBooks[0] : null

  useEffect(() => {
    const loadAll = async () => {
      try {
        setSelectedLoading(true)
        setRecommendedLoading(true)
        setSuggestedLoading(true)

        const [selected, recommended, suggested] = await Promise.all([
          getSelectedBooks(),
          getRecommendedBooks(),
          getSuggestedBooks()
        ])

        setSelectedBooks(selected)
        setRecommendedBooks(recommended)
        setSuggestedBooks(suggested)
      } catch (error) {
        console.error("Error loading books:", error)
      } finally {
        setSelectedLoading(false)
        setRecommendedLoading(false)
        setSuggestedLoading(false)
      }
    }

    loadAll()
  }, [])

  return (
    <div className={styles.row}>
      <div className={styles.container}>
        <div className={styles.foryou__wrapper}>
          <div className={styles.foryou__title}>Selected just for you</div>
          {selectedLoading ? (
            <div className={`${styles.selected__book} ${styles.skeletonCard}`}>
              <div className={`${styles.skeletonBlock} ${styles.skeletonSubtitle}`} />
              <div className={styles.selected__bookline} />
              <div className={styles.selected__bookcontent}>
                <div className={`${styles.skeletonBlock} ${styles.skeletonImg}`} />
                <div className={styles.selectedbook__text}>
                  <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeletonBlock} ${styles.skeletonAuthor}`} />
                  <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
                </div>
              </div>
            </div>
          ) : selectedBook ? (
            <Link href={`/book/${selectedBook.id}`} className={styles.selected__book}>

              <div className={styles.selectedbook__subtitle}>
                {selectedBook.subTitle}
              </div>
              <div className={styles.selected__bookline} />
              <div className={styles.selected__bookcontent}>
                <figure className={styles.book__imgwrapper}>
                  <img src={selectedBook.imageLink} alt={selectedBook.title} />
                </figure>
                <div className={styles.selectedbook__text}>
                  <div className={styles.selected__booktitle}>
                    {selectedBook.title}
                  </div>
                  <div className={styles.selected__bookauthor}>
                    {selectedBook.author}
                  </div>
                  <div className={styles["selected__book--duration-wrapper"]}>
                    <div className={styles["selected__book--icon"]}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" >
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                      </svg>
                    </div>
                    <div className={"selected__book--duration"}>
                      3 min
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
          <div>
            <div className={styles.foryou__title}>
              Recommended For You
            </div>
            <div className={styles.foryou__subtitle}>
              We think you'll like these
            </div>
            <div className={styles["for-you__recommended--books"]}>
              <BookCarousel books={recommendedBooks} loading={recommendedLoading} />
            </div>
          </div>
          <div>
            <div className={styles.foryou__title}>
              Suggested Books
            </div>
            <div className={styles.foryou__subtitle}>
              Browse these books
            </div>
            <div className={styles["for-you__suggested--books"]}>
              <BookCarousel books={suggestedBooks} loading={suggestedLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
