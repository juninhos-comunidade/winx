import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { Category } from "@/types/flashcards"

type CreateCategoryInput = {
  name: string
  icon: string
  color: string
  description?: string
}

type CategoryState = {
  categories: Category[]
  selectedCategoryId: string | null
  createCategory: (input: CreateCategoryInput) => Category
  selectCategory: (categoryId: string) => void
  deleteCategory: (categoryId: string) => void
}

function uid() {
  return crypto.randomUUID()
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      selectedCategoryId: null,
      createCategory: (input) => {
        const category: Category = {
          id: uid(),
          name: input.name.trim(),
          icon: input.icon.trim() || "📚",
          color: input.color,
          description: input.description?.trim() || "",
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          categories: [...state.categories, category],
          selectedCategoryId: state.selectedCategoryId ?? category.id,
        }))

        return category
      },
      selectCategory: (categoryId) => set({ selectedCategoryId: categoryId }),
      deleteCategory: (categoryId) => {
        const nextCategories = get().categories.filter(
          (c) => c.id !== categoryId
        )
        set((state) => ({
          categories: nextCategories,
          selectedCategoryId:
            state.selectedCategoryId === categoryId
              ? (nextCategories[0]?.id ?? null)
              : state.selectedCategoryId,
        }))
      },
    }),
    {
      name: "flashrank-categories",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        selectedCategoryId: state.selectedCategoryId,
      }),
    }
  )
)
