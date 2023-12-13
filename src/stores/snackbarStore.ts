import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'

type SnackbarTypes = 'success' | 'error' | 'warning' | 'info'

export const useSnackbarStore = defineStore('SnackbarStore', () => {
  const state = reactive({
    items: [] as { id: number; message: string; type: SnackbarTypes; timeout: number }[]
  })
  const addItem = (message: string, type: SnackbarTypes) => {
    const nextId = state.items.length
    state.items[nextId] = {
      id: nextId,
      message,
      type,
      timeout: 5000
    }
  }
  const nextItem = computed(() => {
    return state.items[0]
  })

  const removeNextItem = () => {
    state.items.shift()
  }
  return { state, addItem, nextItem, removeNextItem }
})
