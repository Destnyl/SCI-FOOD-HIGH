<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <div class="min-h-screen bg-peach text-maroon">
    <header class="sticky top-0 z-10 bg-peach/80 backdrop-blur border-b border-maroon/10">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="font-poppins text-xl font-bold">SCI-FOOD-HIGH</RouterLink>
        <nav class="flex items-center gap-4">
          <RouterLink class="hover:text-burnt" to="/student">Student</RouterLink>
          <RouterLink class="hover:text-burnt" to="/staff">Staff</RouterLink>
          <RouterLink v-if="!auth.isAuthenticated" class="px-3 py-1 rounded bg-maroon text-white" to="/login">Login</RouterLink>
          <button v-else class="px-3 py-1 rounded bg-burnt text-white" @click="auth.logout()">Logout</button>
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
  
</template>

<style scoped>
</style>
