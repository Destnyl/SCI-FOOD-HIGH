<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const role = ref<'student' | 'staff'>('student')
const identifier = ref('')
const password = ref('')
const isLoading = ref(false)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function login() {
  if (!identifier.value || !password.value) return
  try {
    isLoading.value = true
    await auth.loginWithCredentials(identifier.value, password.value, role.value)
    const redirect = (route.query.redirect as string) || (role.value === 'staff' ? '/staff' : '/student')
    router.push(redirect)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="max-w-md mx-auto bg-white rounded-xl shadow p-6">
    <h2 class="font-poppins text-2xl font-semibold mb-4">Login</h2>
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Role</label>
      <div class="flex gap-3">
        <label class="flex items-center gap-2">
          <input type="radio" value="student" v-model="role"> Student
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" value="staff" v-model="role"> Staff
        </label>
      </div>
    </div>
    <div class="mb-3">
      <label class="block text-sm font-medium mb-1">{{ role === 'student' ? 'Learners Reference Number (LRN)' : 'Staff Name' }}</label>
      <input class="w-full rounded border-maroon/20 focus:border-maroon" v-model="identifier" placeholder="Enter {{ role === 'student' ? 'LRN' : 'Name' }}" />
    </div>
    <div class="mb-6">
      <label class="block text-sm font-medium mb-1">Password</label>
      <input type="password" class="w-full rounded border-maroon/20 focus:border-maroon" v-model="password" placeholder="Password" />
    </div>
    <button :disabled="isLoading" @click="login" class="px-4 py-2 rounded bg-maroon text-white disabled:opacity-50">{{ isLoading ? 'Signing in...' : 'Sign In' }}</button>
  </section>
</template>

<style scoped>
</style>

