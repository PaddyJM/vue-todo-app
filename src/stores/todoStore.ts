import TodoApi from '@/apis/todoApi'
import type { Todo } from '@/types'
import { useAuth0 } from '@auth0/auth0-vue'
import { defineStore } from 'pinia'

const todoApi = new TodoApi()
const auth = useAuth0()

export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    todos: [] as Todo[]
  }),
  actions: {
    addTodo(todo: Todo) {
      if (!auth.user.value.sub) {
        throw new Error('User not logged in')
      }
      this.todos.push(todo)
      todoApi.saveTodos(this.todos, auth.user.value.sub)
    },

    async loadTodos() {
      if (!auth.user.value.sub) {
        throw new Error('User not logged in')
      }
      const todos = await todoApi.loadTodos(auth.user.value.sub)
      this.todos = todos
    }
  }
})
