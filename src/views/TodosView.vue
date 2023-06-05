<script setup lang="ts">
import TodoCreator from '@/components/TodoCreator.vue';
import { ref } from 'vue';

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
  isEditing: boolean;
}
const todoList = ref<Todo[]>([]);

const createTodo = (todo: string) => {
  todoList.value.push({
    id: todoList.value.length + 1,
    todo,
    completed: false,
    isEditing: false,
  });
};
</script>

<template>
  <main>
    <h1>Create Todo</h1>
    <TodoCreator @create-todo="createTodo" />
    <TodoList />
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
}
</style>