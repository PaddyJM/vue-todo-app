<script setup lang="ts">
import TodoCreator from '@/components/TodoCreator.vue'
import TodoItem from '@/components/TodoItem.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import type { Todo } from '@/types'
import { useTodoStore } from '@/stores/todoStore'
import { storeToRefs } from 'pinia'

const loading = ref(true)

const todoStore = useTodoStore()
const auth = useAuth0()

const { todos } = storeToRefs(todoStore)

onMounted(async () => {
  do {
    await new Promise((resolve) => setTimeout(resolve, 100))
  } while (auth.isLoading.value)
  if (!auth.user.value.sub) {
    console.log('no user id')
    loading.value = false
    return
  }
  await todoStore.loadTodos(auth.user.value.sub)
  todos.value = todoStore.todos
  loading.value = false
})

const saveTodo = async () => {
  if (auth.isAuthenticated && auth.user.value.sub) {
    todoStore.saveTodo(auth.user.value.sub)
  } else {
    console.log('not authenticated')
    auth.loginWithRedirect()
  }
}

const createTodo = (message: string) => {
  const todo: Todo = {
    id: todoStore.todos.length + 1,
    todo: message,
    completed: false,
    isEditing: false
  }
  todos.value.push(todo)
  saveTodo()
}

const toggleTodoComplete = (index: number) => {
  todos.value[index].completed = !todos.value[index].completed
  saveTodo()
}

const toggleTodoEdit = (index: number) => {
  todos.value[index].isEditing = !todos.value[index].isEditing
  saveTodo()
}

const updateTodo = (todo: string, index: number) => {
  todos.value[index].todo = todo
}

const deleteTodo = (index: number) => {
  todos.value.splice(index, 1)
  saveTodo()
}
</script>

<template>
  <div v-if="loading">Loading...</div>
  <main v-else-if="auth.user.value">
    <h1>Create Todo</h1>
    <TodoCreator @create-todo="createTodo" />
    <ul class="todo-list" v-if="todos && todos.length > 0">
      <TodoItem v-for="(todo, index) in todos" :key="todo.id" :todo="todo" :index="index"
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
