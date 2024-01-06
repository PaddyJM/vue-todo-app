<script setup lang="ts">
import { reactive } from 'vue'
import TodoButton from './TodoButton.vue'

const emit = defineEmits(['createTodo'])

const todoState = reactive({
  todo: '',
  invalid: false,
  errorMessage: ''
})

const createTodo = () => {
  if (todoState.todo === '') {
    todoState.invalid = true
    todoState.errorMessage = 'Please enter a todo'
    return
  }
  emit('createTodo', todoState.todo)
  todoState.todo = ''
  todoState.invalid = false
}
</script>

<template>
  <div class="todo-input" :class="{ 'input-error': todoState.invalid }">
    <input
      type="text"
      placeholder="Enter a todo"
      v-model="todoState.todo"
      @keyup.enter="createTodo()"
    />
    <TodoButton @click="createTodo()" />
  </div>
  <p v-show="todoState.invalid" class="error">{{ todoState.errorMessage }}</p>
</template>

<style lang="scss" scoped>
.input-wrap {
  display: flex;
  transition: 250ms ease;
  border: 2px solid #41b080;

  &.input-error {
    border-color: red;
  }

  &:focus-within {
    box-shadow:
      0 -4px 6px -1px rgb(0 0 0 / 0.1),
      0 -2px 4px -2px rgb(0 0 0 / 0.1);
  }

  input {
    width: 100%;
    padding: 8px 6px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}

.error-msg {
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: red;
}
</style>
