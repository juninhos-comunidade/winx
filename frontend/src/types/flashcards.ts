export type Category = {
  id: string
  name: string
  icon: string
  color: string
  description: string
  createdAt: string
}

export type FlashcardDifficulty = "easy" | "normal" | "hard"

export type Flashcard = {
  id: string
  categoryId: string
  question: string
  answer: string
  tags: string[]
  difficulty: FlashcardDifficulty
  source: "manual" | "json"
  createdAt: string
}

export type ReviewRating = "wrong" | "hard" | "right" | "easy"
