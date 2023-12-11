import TodoApi from '@/apis/todoApi'
import type { Todo } from '@/types'
import { defineStore } from 'pinia'

const todoApi = new TodoApi()
export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    todos: [] as Todo[]
  }),
  actions: {
    saveTodo(user: string) {
      todoApi.saveTodos(this.todos, user)
    },

    async loadTodos(userId: string) {
      const response = await todoApi.loadTodos(userId)
      this.todos = response.todos
    }
  }
})
