<script setup lang="ts">
definePageMeta({
  middleware: "auth-staff",
  layout: "staff",
});

const { success, error } = useNotification();

// Registration form state
const userType = ref<"student" | "staff">("student");
const identifier = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

// Form validation
const isFormValid = computed(() => {
  return (
    identifier.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 6
  );
});

const passwordMismatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value;
});

// Registration function
async function registerUser() {
  if (!isFormValid.value) return;

  try {
    isLoading.value = true;
    const { $auth, $db } = useNuxtApp();

    // Create email format for Firebase auth
    const email = `${identifier.value}@scifood.local`;

    // Import necessary Firebase functions
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { collection, addDoc } = await import("firebase/firestore");

    // Create user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      email,
      password.value
    );

    // Create user document in Firestore
    await addDoc(collection($db, "users"), {
      uid: userCredential.user.uid,
      email: email,
      identifier: identifier.value,
      userType: userType.value,
      createdAt: Date.now(),
      displayName: identifier.value,
    });

    success(
      "User Registered!",
      `${
        userType.value === "student" ? "Student" : "Staff"
      } account created successfully for ${identifier.value}`,
      { duration: 5000 }
    );

    // Reset form
    identifier.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (err: any) {
    console.error("Registration error:", err);
    error(
      "Registration Failed",
      err.message || "Failed to create user account. Please try again.",
      { duration: 5000 }
    );
  } finally {
    isLoading.value = false;
  }
}

// Clear confirm password when password changes
watch(password, () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    // Visual feedback will be provided by computed property
  }
});
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h2 class="font-poppins text-3xl font-bold text-gray-800 mb-2">
        User Registration
      </h2>
      <p class="text-gray-600">Create new student and staff accounts</p>
    </div>

    <div class="max-w-2xl mx-auto">
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="p-8">
          <!-- User Type Selection -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-3"
              >Account Type</label
            >
            <div class="flex gap-4">
              <label
                class="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 transition-colors hover:bg-gray-50 flex-1"
                :class="
                  userType === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  value="student"
                  v-model="userType"
                  class="text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <div class="font-medium">Student Account</div>
                  <div class="text-sm text-gray-500">
                    For students to place orders
                  </div>
                </div>
              </label>
              <label
                class="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 transition-colors hover:bg-gray-50 flex-1"
                :class="
                  userType === 'staff'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200'
                "
              >
                <input
                  type="radio"
                  value="staff"
                  v-model="userType"
                  class="text-green-500 focus:ring-green-500"
                />
                <div>
                  <div class="font-medium">Staff Account</div>
                  <div class="text-sm text-gray-500">
                    For staff to manage orders
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Identifier Field -->
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{
                userType === "student"
                  ? "Learners Reference Number (LRN)"
                  : "Staff ID/Username"
              }}
            </label>
            <div class="relative">
              <input
                type="text"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                v-model="identifier"
                :placeholder="`Enter ${
                  userType === 'student' ? 'LRN' : 'Staff ID'
                }`"
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-4 0V4a2 2 0 014 0v2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Password</label
            >
            <div class="relative">
              <input
                type="password"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                v-model="password"
                placeholder="Enter password (minimum 6 characters)"
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
            <div
              v-if="password && password.length < 6"
              class="mt-1 text-sm text-red-600"
            >
              Password must be at least 6 characters long
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Confirm Password</label
            >
            <div class="relative">
              <input
                type="password"
                class="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none"
                :class="
                  passwordMismatch
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                "
                v-model="confirmPassword"
                placeholder="Confirm your password"
              />
              <div
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg
                  v-if="passwordMismatch"
                  class="h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <svg
                  v-else-if="confirmPassword && password === confirmPassword"
                  class="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
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
            <div v-if="passwordMismatch" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </div>
          </div>

          <!-- Submit Button -->
          <button
            :disabled="!isFormValid || isLoading"
            @click="registerUser"
            class="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            :class="
              isFormValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            "
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            {{
              isLoading
                ? "Creating Account..."
                : `Create ${
                    userType === "student" ? "Student" : "Staff"
                  } Account`
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
