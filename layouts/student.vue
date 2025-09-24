<script setup lang="ts">
const auth = useAuthStore();
const cart = useCartStore();

// Computed properties for navigation state
const route = useRoute();
const totalCartItems = computed(() =>
  cart.items.reduce((sum, item) => sum + item.quantity, 0)
);

function logout() {
  auth.logout();
  navigateTo("/login");
}

// Sidebar toggle for mobile
import { ref } from "vue";
const sidebarOpen = ref(false);
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
function closeSidebar() {
  sidebarOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-peach text-maroon">
    <!-- Sidebar for mobile -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black/40 sm:hidden"
        @click="closeSidebar"
      ></div>
    </transition>
    <transition name="slide">
      <aside
        v-if="sidebarOpen"
        class="fixed top-0 left-0 z-40 h-full w-64 bg-peach shadow-lg sm:hidden flex flex-col"
      >
        <div
          class="flex items-center justify-between px-4 py-4 border-b border-maroon/10"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-3 font-poppins text-xl font-bold"
            @click="closeSidebar"
          >
            <img
              src="/school_logo.png"
              alt="School Logo"
              class="w-8 h-8 rounded-full"
            />
            <span>SCI-FOOD-HIGH</span>
          </NuxtLink>
          <button @click="closeSidebar" aria-label="Close sidebar">
            <svg
              class="w-6 h-6 text-maroon"
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
          </button>
        </div>
        <nav class="flex flex-col gap-2 px-4 py-6">
          <NuxtLink
            to="/student"
            @click="closeSidebar"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student'
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
              />
            </svg>
            <span>Menu</span>
          </NuxtLink>
          <NuxtLink
            to="/student/cart"
            @click="closeSidebar"
            class="relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student/cart'
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7.5"
                />
              </svg>
              <div
                v-if="totalCartItems > 0"
                class="absolute -top-2 -right-2 bg-burnt text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
              >
                {{ totalCartItems > 99 ? "99+" : totalCartItems }}
              </div>
            </div>
            <span>Cart</span>
          </NuxtLink>
          <NuxtLink
            to="/student/orders"
            @click="closeSidebar"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student/orders'
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Orders</span>
          </NuxtLink>
          <button
            @click="logout"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-burnt text-white hover:bg-burnt/90 transition-all duration-200 shadow-sm hover:shadow-md"
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
              />
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </transition>
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
        <!-- Hamburger for mobile -->
        <button
          @click="toggleSidebar"
          class="sm:hidden flex items-center justify-center p-2 rounded-lg hover:bg-maroon/10"
          aria-label="Open sidebar"
        >
          <svg
            class="w-7 h-7 text-maroon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <!-- Desktop nav -->
        <nav class="hidden sm:flex items-center gap-6">
          <NuxtLink
            to="/student"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student'
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
              />
            </svg>
            <span class="hidden sm:inline">Menu</span>
          </NuxtLink>
          <NuxtLink
            to="/student/cart"
            class="relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student/cart'
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7.5"
                />
              </svg>
              <div
                v-if="totalCartItems > 0"
                class="absolute -top-2 -right-2 bg-burnt text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse"
              >
                {{ totalCartItems > 99 ? "99+" : totalCartItems }}
              </div>
            </div>
            <span class="hidden sm:inline">Cart</span>
          </NuxtLink>
          <NuxtLink
            to="/student/orders"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10"
            :class="
              route.path === '/student/orders'
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="hidden sm:inline">Orders</span>
          </NuxtLink>
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
              />
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
