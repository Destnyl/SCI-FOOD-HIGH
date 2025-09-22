<script setup lang="ts">
// Set page title
useHead({
  title: "Login - SCI-FOOD-HIGH",
});

const role = ref<"student" | "staff">("student");
const identifier = ref("");
const password = ref("");
const isLoading = ref(false);

const auth = useAuthStore();
const route = useRoute();

// Initialize auth store after component is mounted (client-side)
onMounted(() => {
  auth.init();
});

// Redirect if already authenticated
watchEffect(() => {
  if (auth.isReady && auth.isAuthenticated && auth.userRole) {
    const redirectTo = auth.userRole === "staff" ? "/staff" : "/student";
    navigateTo(redirectTo, { replace: true });
  }
});

async function login() {
  if (!identifier.value || !password.value) return;
  try {
    isLoading.value = true;
    await auth.loginWithCredentials(
      identifier.value,
      password.value,
      role.value
    );
    const redirect =
      (route.query.redirect as string) ||
      (role.value === "staff" ? "/staff" : "/student");
    await navigateTo(redirect);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <section class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
    <!-- Logo and Title -->
    <div class="text-center mb-8">
      <img
        src="/school_logo.png"
        alt="School Logo"
        class="w-16 h-16 mx-auto mb-4 rounded-full shadow-md"
      />
      <h2 class="font-poppins text-2xl font-semibold text-maroon">
        Welcome Back
      </h2>
      <p class="text-sm text-gray-600 mt-1">Sign in to your account</p>
    </div>
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">Role</label>
      <div class="flex gap-4">
        <label
          class="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
          :class="
            role === 'student'
              ? 'border-maroon bg-maroon/5 text-maroon'
              : 'border-gray-200'
          "
        >
          <input
            type="radio"
            value="student"
            v-model="role"
            class="text-maroon focus:ring-maroon"
          />
          <span class="font-medium">Student</span>
        </label>
        <label
          class="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
          :class="
            role === 'staff'
              ? 'border-maroon bg-maroon/5 text-maroon'
              : 'border-gray-200'
          "
        >
          <input
            type="radio"
            value="staff"
            v-model="role"
            class="text-maroon focus:ring-maroon"
          />
          <span class="font-medium">Staff</span>
        </label>
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-semibold text-gray-700 mb-2">{{
        role === "student" ? "Learners Reference Number (LRN)" : "Staff Name"
      }}</label>
      <div class="relative">
        <input
          class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none"
          v-model="identifier"
          :placeholder="`Enter ${role === 'student' ? 'LRN' : 'Name'}`"
        />
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <label class="block text-sm font-semibold text-gray-700 mb-2"
        >Password</label
      >
      <div class="relative">
        <input
          type="password"
          class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none"
          v-model="password"
          placeholder="Enter your password"
        />
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>
    </div>
    <button
      :disabled="isLoading || !identifier || !password"
      @click="login"
      class="w-full py-3 px-4 rounded-lg bg-maroon text-white font-semibold hover:bg-maroon/90 focus:ring-4 focus:ring-maroon/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {{ isLoading ? "Signing in..." : "Sign In" }}
    </button>
  </section>
</template>
