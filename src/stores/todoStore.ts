import TodoApi from '@/apis/todoApi'
import type { Todo } from '@/types'
import { useAuth0 } from '@auth0/auth0-vue'
import { defineStore } from 'pinia'

const todoApi = new TodoApi()
export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    todos: [] as Todo[]
  }),
  actions: {
    saveTodo(todo: Todo, user: string) {
      this.todos.push(todo)
      todoApi.saveTodos(this.todos, user)
    },

    async loadTodos(userId: string) {
      const response = await todoApi.loadTodos(userId)
      this.todos = response.todos
    }
  }
})
