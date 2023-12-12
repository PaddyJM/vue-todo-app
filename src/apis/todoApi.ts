import { useSnackbarStore } from '@/stores/snackbarStore'
import type { Todo } from '@/types'

type TodoResponse = {
  id?: string
  todoList?: Todo[]
}

export default class TodoApi {
  async saveTodos(todos: Todo[], userId: string) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/client/${userId}/todo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ todos })
    })
    if (!response.ok) {
      useSnackbarStore().addItem('Error saving todos', 'error')
      throw new Error(JSON.stringify({ message: 'Error saving todos', response }))
    }

    return response.json()
  }

  async loadTodos(userId: string): Promise<TodoResponse> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/client/${userId}/todo`)
    if (!response.ok && response.status !== 404) {
      useSnackbarStore().addItem('Error saving todos', 'error')
      throw new Error(JSON.stringify({ message: 'Error loading todos', response }))
    }

    return response.json()
  }
}
