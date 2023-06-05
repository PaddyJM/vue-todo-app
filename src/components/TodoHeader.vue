<script setup lang="ts">
import { RouterLink } from 'vue-router';

  defineProps<{msg: string}>()
</script>


<template>
  <header>
    <nav class="container">
      <div class='branding'>
        <img src="../assets/Vue_Logo_Black.png" />
        <h1>{{ msg }}</h1>
      </div>
      <ul class="nav-routes">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped></style>
