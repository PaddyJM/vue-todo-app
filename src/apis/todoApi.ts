import type { Todo } from '@/types'

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
      throw new Error('Error saving todos')
    }

    return response.json()
  }

  async loadTodos(userId: string): Promise<Todo[]> {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/client/${userId}/todo`)
    if (!response.ok) {
      throw new Error('Error loading todos')
    }

    return response.json()
  }
}
