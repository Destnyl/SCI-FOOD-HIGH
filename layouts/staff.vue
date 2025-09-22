<script setup lang="ts">
const auth = useAuthStore();
const orders = useOrdersStore();

// Computed properties for navigation state and notifications
const route = useRoute();
const pendingOrdersCount = computed(() => orders.pendingCount || 0);

function logout() {
  auth.logout();
  navigateTo("/login");
}

// Initialize orders store to get pending count
onMounted(() => {
  orders.initStaff();
});
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
          SCI-FOOD-HIGH
        </NuxtLink>
        <nav class="flex items-center gap-6">
          <!-- Dashboard Button -->
          <NuxtLink
            to="/staff"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/staff'
                ? 'bg-white/20 text-maroon shadow-sm'
                : 'text-maroon/80 hover:text-maroon'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span class="hidden sm:inline">Dashboard</span>
          </NuxtLink>

          <!-- Menu Management Button -->
          <NuxtLink
            to="/staff/menu"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/staff/menu'
                ? 'bg-white/20 text-maroon shadow-sm'
                : 'text-maroon/80 hover:text-maroon'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            <span class="hidden sm:inline">Menu</span>
          </NuxtLink>

          <!-- Orders Button with Badge -->
          <NuxtLink
            to="/staff/orders"
            class="relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/staff/orders'
                ? 'bg-white/20 text-maroon shadow-sm'
                : 'text-maroon/80 hover:text-maroon'
            "
          >
            <div class="relative">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <div
                v-if="pendingOrdersCount > 0"
                class="absolute -top-2 -right-2 bg-burnt text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
              >
                {{ pendingOrdersCount > 99 ? "99+" : pendingOrdersCount }}
              </div>
            </div>
            <span class="hidden sm:inline">Orders</span>
          </NuxtLink>

          <!-- History Button -->
          <NuxtLink
            to="/staff/history"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/staff/history'
                ? 'bg-white/20 text-maroon shadow-sm'
                : 'text-maroon/80 hover:text-maroon'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="hidden sm:inline">History</span>
          </NuxtLink>

          <!-- User Registration Button -->
          <NuxtLink
            to="/staff/register"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/staff/register'
                ? 'bg-white/20 text-maroon shadow-sm'
                : 'text-maroon/80 hover:text-maroon'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m0-3h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            <span class="hidden sm:inline">Register</span>
          </NuxtLink>

          <!-- Logout Button -->
          <div class="h-6 w-px bg-maroon/20 mx-2"></div>
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-burnt text-white hover:bg-burnt/90 transition-all duration-200 shadow-sm hover:shadow-md"
            @click="logout"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
