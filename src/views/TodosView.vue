<script setup lang="ts">
import TodoCreator from '@/components/TodoCreator.vue'
import TodoItem from '@/components/TodoItem.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref, watchEffect } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import type { Todo } from '@/types'

const todoList = ref<Todo[]>([])

const loading = ref<boolean>(true)

const auth = useAuth0()

watchEffect(async () => {
  loading.value = false
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/client/${auth.user.value.sub}/todo`
  )
  const data = await response.json()
  if (data.todoList) {
    todoList.value = data.todoList
  }
})

onMounted(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/client/${auth.user.value.sub}/todo`
  )
  const data = await response.json()
  if (data.todoList) {
    todoList.value = data.todoList
  }
})

const saveTodoList = async (todoList: Todo[]) => {
  if (auth.isAuthenticated) {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/client/${auth.user.value.sub}/todo`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ todoList })
      }
    )
    console.log(response)
  } else {
    console.log('not authenticated')
    auth.loginWithRedirect()
  }
}

const createTodo = (todo: string) => {
  if (!todoList.value) todoList.value = []
  todoList.value.push({
    id: todoList.value.length + 1,
    todo,
    completed: false,
    isEditing: false
  })
  saveTodoList(todoList.value)
}

const toggleTodoComplete = (index: number) => {
  todoList.value[index].completed = !todoList.value[index].completed
}

const toggleTodoEdit = (index: number) => {
  todoList.value[index].isEditing = !todoList.value[index].isEditing
}

const updateTodo = (todo: string, index: number) => {
  todoList.value[index].todo = todo
}

const deleteTodo = (index: number) => {
  todoList.value.splice(index, 1)
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <main v-else-if="auth.user.value">
    <h1>Create Todo</h1>
    <TodoCreator @create-todo="createTodo" />
    <ul class="todo-list" v-if="todoList.length > 0">
      <TodoItem v-for="(todo, index) in todoList" :key="todo.id" :todo="todo" :index="index"
        @toggle-complete="toggleTodoComplete" @toggle-edit="toggleTodoEdit" @update-todo="updateTodo"
        @delete-todo="deleteTodo" />
    </ul>
    <p class="todos-msg" v-else>
      <Icon icon="emojione:sad-but-relieved-face" class="icon" />
      <span>You have no todos! Please add one!</span>
    </p>
  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 16px;

  h1 {
    margin-bottom: 16px;
    text-align: center;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    margin-top: 24px;
    gap: 20px;
  }

  .todos-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
  }
}
</style>
