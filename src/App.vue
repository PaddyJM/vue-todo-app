<script setup lang="ts">
import { RouterView } from 'vue-router'
import TodoHeader from './components/TodoHeader.vue'
</script>

<template>
  <TodoHeader msg="Vue Todo App" />
  <RouterView />
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300&display=swap');

* {
  font-family: 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
