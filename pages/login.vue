<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

// Set page title
useHead({
  title: "Login - SCI-FOOD-HIGH",
});

const identifier = ref("");
const password = ref("");
const userType = ref<"student" | "staff" | null>(null);

const isLoading = ref(false);
const errorMessage = ref("");

// Debounced function to check user type
const debouncedCheckUser = useDebounceFn(async () => {
  if (identifier.value.length > 0) {
    try {
      userType.value = await auth.checkUserType(identifier.value);
      showUserTypeSelection.value = !userType.value; // Show selection if user not found
      if (userType.value) {
        selectedUserType.value = null; // Reset selection if existing user found
      }
    } catch (err) {
      userType.value = null;
      showUserTypeSelection.value = true;
    }
  } else {
    userType.value = null;
    showUserTypeSelection.value = false;
    selectedUserType.value = null;
  }
}, 500);

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

// For new user registration
const showUserTypeSelection = ref(false);
const selectedUserType = ref<"student" | "staff" | null>(null);

async function login() {
  errorMessage.value = "";
  if (!identifier.value || !password.value) {
    errorMessage.value = "Please enter both identifier and password.";
    return;
  }

  try {
    isLoading.value = true;

    // If it's a new user, ensure they've selected a type
    if (showUserTypeSelection.value && !selectedUserType.value) {
      errorMessage.value = "Please select your account type.";
      return;
    }

    // Proceed with login
    await auth.loginWithCredentials(
      identifier.value,
      password.value,
      selectedUserType.value // This will be null for existing users
    );

    const redirect =
      (route.query.redirect as string) ||
      (auth.userRole === "staff" ? "/staff" : "/student");
    await navigateTo(redirect);
  } catch (err: any) {
    // Always show a user-friendly message for invalid credentials
    if (err.message === "user-not-found") {
      errorMessage.value = "User not found. Please check your identifier.";
    } else if (
      err.code === "auth/wrong-password" ||
      err.code === "auth/invalid-credential"
    ) {
      errorMessage.value = "Invalid password. Please try again.";
    } else if (err.code === "auth/too-many-requests") {
      errorMessage.value = "Too many failed attempts. Please try again later.";
    } else if (err.message === "User data not found in database") {
      errorMessage.value =
        "User account not properly set up. Please contact administrator.";
    } else {
      errorMessage.value = "Login failed. Please try again.";
    }
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
    <div class="mb-4">
      <label class="block text-sm font-semibold text-gray-700 mb-2"
        >LRN/Username</label
      >
      <div>
        <div class="relative">
          <input
            class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none"
            v-model="identifier"
            @input="debouncedCheckUser"
            placeholder="Enter your LRN or Username"
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div v-if="identifier && userType" class="mt-1 text-sm text-maroon">
          Logging in as: {{ userType === "student" ? "Student" : "Staff" }}
        </div>
        <div v-else-if="identifier && showUserTypeSelection" class="mt-4">
          <p class="text-sm text-gray-600 mb-2">
            New user? Select your account type:
          </p>
          <div class="flex gap-4">
            <button
              @click="selectedUserType = 'student'"
              :class="[
                'px-4 py-2 rounded-lg border-2 transition-colors',
                selectedUserType === 'student'
                  ? 'border-maroon bg-maroon/5 text-maroon'
                  : 'border-gray-200 hover:bg-gray-50',
              ]"
            >
              Student
            </button>
            <button
              @click="selectedUserType = 'staff'"
              :class="[
                'px-4 py-2 rounded-lg border-2 transition-colors',
                selectedUserType === 'staff'
                  ? 'border-maroon bg-maroon/5 text-maroon'
                  : 'border-gray-200 hover:bg-gray-50',
              ]"
            >
              Staff
            </button>
          </div>
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
    <div v-if="errorMessage" class="mb-4 text-red-600 text-sm text-center">
      {{ errorMessage }}
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
