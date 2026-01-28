const RECOMMENDED_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
const SUGGESTED_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
const SELECTED_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
const BOOK_ID_BASE = "https://us-central1-summaristt.cloudfunctions.net/getBook"
const SEARCH_BASE = "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle"

if (!RECOMMENDED_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_API_RECOMMENDED")
}
if (!SUGGESTED_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_API_SUGGESTED")
}
if (!SELECTED_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_API_SELECTED")
}
if (!BOOK_ID_BASE) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_API_BOOK_ID_BASE")
}

export type Book = {
  id: string
  title: string
  subTitle: string
  author: string
  imageLink: string
  audioLink: string
  totalRating: number
  averageRating: number
  keyIdeas: number
  type: string
  status: string
  summary: string
  bookDescription: string
  authorDescription: string
  subscriptionRequired: boolean
  tags: string[]
  duration: string
}

export type SearchBook = {
  id: string
  title: string
  author: string
  imageLink: string
  averageRating?: number
  totalRating?: number
  duration: string
}

export async function searchBooks(search: string, signal?: AbortSignal) {
  const q = search.trim()
  if (!q) return []

  const url = `${SEARCH_BASE}?search=${encodeURIComponent(q)}`

  const res = await fetch(url, { signal, cache: "no-store" })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`searchBooks failed ${res.status}: ${text.slice(0, 200)}`)
  }

  return (await res.json()) as SearchBook[]
}

async function fetchBooks(url: string): Promise<Book[]> {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch books from ${url} (status ${res.status})`)
  }

  const data = await res.json()
  return data as Book[]
}

export async function getRecommendedBooks(): Promise<Book[]> {
  return fetchBooks(RECOMMENDED_URL!)
}

export async function getSuggestedBooks(): Promise<Book[]> {
  return fetchBooks(SUGGESTED_URL!)
}

export async function getSelectedBooks(): Promise<Book[]> {
  return fetchBooks(SELECTED_URL!)
}

export type BookDetail = Book & {
  summary?: string
}

export async function getBookById(id: string): Promise<BookDetail> {
  const url = `${BOOK_ID_BASE}?id=${encodeURIComponent(id)}`

  const res = await fetch(url, { cache: "no-store" })
  const text = await res.text()

  if (!res.ok) {
    throw new Error(`getBookById failed (${res.status}). URL: ${url}. Body: ${text.slice(0, 200)}`)
  }

  if (!text.trim()) {
    throw new Error(`getBookById returned empty body. URL: ${url}`)
  }

  try {
    return JSON.parse(text) as BookDetail
  } catch {
    throw new Error(`getBookById returned non-JSON. URL: ${url}. Body: ${text.slice(0, 200)}`)
  }
}

export function getBookDuration(audioUrl: string): Promise<number> {
  if (typeof window === "undefined") {
    return Promise.resolve(0)
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.preload = "metadata"
    audio.src = audioUrl

    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("error", onError)
    }

    const onLoaded = () => {
      cleanup()
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    const onError = () => {
      cleanup()
      reject(new Error("Failed to load audio metadata"))
    }

    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("error", onError)
  })
}