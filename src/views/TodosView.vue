<script setup lang="ts">
import TodoCreator from '@/components/TodoCreator.vue';
import TodoItem from '@/components/TodoItem.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
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

const toggleTodoComplete = (index: number) => {
  todoList.value[index].completed = !todoList.value[index].completed;
};
</script>

<template>
  <main>
    <h1>Create Todo</h1>
    <TodoCreator @create-todo="createTodo" />
    <ul class="todo-list" v-if="todoList.length > 0">
      <TodoItem v-for="(todo, index) in todoList" :key="todo.id" :todo="todo" :index="index" @toggle-complete="toggleTodoComplete" />
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