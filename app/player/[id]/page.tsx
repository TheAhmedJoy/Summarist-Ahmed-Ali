import { getBookById } from "@/util/API"
import BookPlayer from "./BookPlayer"
import styles from "../../components/styles/BookContent.module.css"

type PlayerPageProps = {
    params: { id: string } | Promise<{ id: string }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
    const { id } = await params
    const book = await getBookById(id)

    return (
        <div className={styles.summary}>
            <div className={styles["audio__book--summary"]}>
                <div className={styles["audio__book--summary-title"]}>
                    <b>
                        {book.title}
                    </b>
                </div>
                <div className={styles["audio__book--summary-text"]}>
                    {book.summary}
                </div>
            </div>
            <BookPlayer title={book.title} author={book.author} audioLink={book.audioLink} imageLink={book.imageLink} />
        </div>
    )
}