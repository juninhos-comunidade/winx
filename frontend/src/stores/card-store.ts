import { create } from "zustand"
import { createJSONStorage,persist } from "zustand/middleware"

import type { Flashcard, FlashcardDifficulty } from "@/types/flashcards"

type CardInput = {
  categoryId: string
  question: string
  answer: string
  tags?: string[]
  difficulty?: FlashcardDifficulty
  source?: "manual" | "json"
}

type CardState = {
  cards: Flashcard[]
  addCard: (input: CardInput) => Flashcard
  addCards: (inputs: CardInput[]) => Flashcard[]
  deleteCard: (cardId: string) => void
  deleteCardsByCategory: (categoryId: string) => void
}

function uid() {
  return crypto.randomUUID()
}

function normalizeTags(tags?: string[]) {
  return Array.from(
    new Set((tags ?? []).map((tag) => tag.trim()).filter(Boolean))
  )
}

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cards: [],
      addCard: (input) => {
        const card: Flashcard = {
          id: uid(),
          categoryId: input.categoryId,
          question: input.question.trim(),
          answer: input.answer.trim(),
          tags: normalizeTags(input.tags),
          difficulty: input.difficulty ?? "normal",
          source: input.source ?? "manual",
          createdAt: new Date().toISOString(),
        }

        set((state) => ({ cards: [...state.cards, card] }))
        return card
      },
      addCards: (inputs) => {
        const cards = inputs.map((input) => ({
          id: uid(),
          categoryId: input.categoryId,
          question: input.question.trim(),
          answer: input.answer.trim(),
          tags: normalizeTags(input.tags),
          difficulty: input.difficulty ?? "normal",
          source: input.source ?? "json",
          createdAt: new Date().toISOString(),
        }))

        set((state) => ({ cards: [...state.cards, ...cards] }))
        return cards
      },
      deleteCard: (cardId) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== cardId),
        })),
      deleteCardsByCategory: (categoryId) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.categoryId !== categoryId),
        })),
    }),
    {
      name: "flashrank-cards",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cards: state.cards }),
    }
  )
)
