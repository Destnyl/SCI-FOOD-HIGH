<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <div class="mb-4 flex gap-3">
      <RouterLink class="px-3 py-1 rounded bg-amber text-maroon" to="/student">Menu</RouterLink>
      <RouterLink class="px-3 py-1 rounded bg-amber text-maroon" to="/student/cart">Cart</RouterLink>
      <RouterLink class="px-3 py-1 rounded bg-amber text-maroon" to="/student/orders">Orders</RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>

