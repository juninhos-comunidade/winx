import { create } from "zustand"

import type { ReviewRating } from "@/types/flashcards"

type ReviewState = {
  categoryId: string | null
  cardIds: string[]
  currentIndex: number
  flipped: boolean
  done: boolean
  elapsedSeconds: number
  results: ReviewRating[]
  startSession: (categoryId: string, cardIds: string[]) => void
  toggleFlip: () => void
  answer: (rating: ReviewRating) => void
  tick: () => void
  restart: () => void
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  categoryId: null,
  cardIds: [],
  currentIndex: 0,
  flipped: false,
  done: false,
  elapsedSeconds: 0,
  results: [],
  startSession: (categoryId, cardIds) =>
    set({
      categoryId,
      cardIds,
      currentIndex: 0,
      flipped: false,
      done: cardIds.length === 0,
      elapsedSeconds: 0,
      results: [],
    }),
  toggleFlip: () => set((state) => ({ flipped: !state.flipped })),
  answer: (rating) => {
    const { cardIds, currentIndex, done } = get()

    if (done || cardIds.length === 0) return

    const nextResults = [...get().results, rating]
    const isLast = currentIndex + 1 >= cardIds.length

    set({
      results: nextResults,
      currentIndex: isLast ? currentIndex : currentIndex + 1,
      flipped: false,
      done: isLast,
    })
  },
  tick: () =>
    set((state) =>
      state.done ? state : { elapsedSeconds: state.elapsedSeconds + 1 }
    ),
  restart: () =>
    set({
      currentIndex: 0,
      flipped: false,
      done: false,
      elapsedSeconds: 0,
      results: [],
    }),
}))
