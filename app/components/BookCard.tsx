import Link from "next/link";
import { Book } from "@/util/API";
import styles from "./styles/BookCard.module.css"
import BookDuration from "./BookDuration";

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    
    const requiresSub = book.subscriptionRequired === true

    return (
        <div className={styles["for-you__recommended--books"]}>
            <Link className={styles["for-you__recommended--books-link"]} href={`/book/${book.id}`}>
                <figure className={styles["book__img--wrapper"]}>
                    {requiresSub &&
                        <div className={styles["book__pill"]}>
                            Premium
                        </div>}
                    <img className={styles["book__img"]} src={book.imageLink} alt={book.title} />
                </figure>
                <div className={styles["recommended__book--title"]}>
                    {book.title}
                </div>
                <div className={styles["recommended__book--author"]}>
                    {book.author}
                </div>
                <div className={styles["recommended__book--subtitle"]}>
                    {book.subTitle}
                </div>
                <div className={styles["recommended__book--details-wrapper"]}>
                    <div className={styles["recommended__book--details"]}>
                        <div className={styles["recommended__book--details-icon"]}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                                <path d="M13 7h-2v6h6v-2h-4z"></path>
                            </svg>
                        </div>
                        <div className={styles["recommended__book--details-text"]}>
                            <BookDuration audioLink={book.audioLink} />
                        </div>
                    </div>
                    <div className={styles["recommended__book--details"]}>
                        <div className={styles["recommended__book--details-icon"]}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                            </svg>
                        </div>
                        <div className={styles["recommended__book--details-text"]}>
                            {book.averageRating}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export function BookCardSkeleton() {
    return (
        <div className={`${styles["for-you__recommended--books"]} ${styles.skeletonCard}`}>
            <div className={styles["for-you__recommended--books-link"]}>
                <figure className={styles["book__img--wrapper"]}>
                    <div className={`${styles.skeletonBlock} ${styles.skeletonImg}`} />
                </figure>

                <div className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
                <div className={`${styles.skeletonBlock} ${styles.skeletonAuthor}`} />
                <div className={`${styles.skeletonBlock} ${styles.skeletonSubtitle}`} />

                <div className={styles["recommended__book--details-wrapper"]}>
                    <div className={styles["recommended__book--details"]}>
                        <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
                    </div>
                    <div className={styles["recommended__book--details"]}>
                        <div className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}