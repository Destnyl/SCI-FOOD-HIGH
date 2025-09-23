<script setup lang="ts">
const auth = useAuthStore();

// Initialize auth on app start
onMounted(() => auth.init());
</script>

<template>
  <div class="min-h-screen bg-peach text-maroon">
    <header
      class="sticky top-0 z-10 bg-peach/80 backdrop-blur border-b border-maroon/10"
    >
      <div
        class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-3 font-poppins text-xl font-bold"
        >
          <img
            src="/school_logo.png"
            alt="School Logo"
            class="w-8 h-8 rounded-full"
          />
          <span class="hidden sm:inline">SCI-FOOD-HIGH</span>
        </NuxtLink>
        <nav class="flex items-center gap-4">
          <NuxtLink class="hover:text-burnt" to="/student">Student</NuxtLink>
          <NuxtLink class="hover:text-burnt" to="/staff">Staff</NuxtLink>
          <NuxtLink
            v-if="!auth.isAuthenticated"
            class="px-3 py-1 rounded bg-maroon text-white"
            to="/login"
            >Login</NuxtLink
          >
          <button
            v-else
            class="px-3 py-1 rounded bg-burnt text-white"
            @click="auth.logout()"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
