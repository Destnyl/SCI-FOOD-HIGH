<script setup lang="ts">
definePageMeta({
  middleware: "auth-student",
  layout: "student",
});

const orders = useOrdersStore();
const activeTab = ref<"active" | "history">("active");
const selectedStatus = ref<null | string>(null);

function toggleStatusFilter(status: null | string) {
  selectedStatus.value = selectedStatus.value === status ? null : status;
  // if filtering by history-related status, switch to history tab
  if (status === "completed") activeTab.value = "history";
  if (status === "pending" || status === "confirmed")
    activeTab.value = "active";
}
const selectedTimeFilter = ref<"all" | "week" | "month">("all");

// Computed properties for filtering orders
const activeOrders = computed(() =>
  orders.myOrders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  )
);

const filteredActiveOrders = computed(() => {
  if (!selectedStatus.value) return activeOrders.value;
  return activeOrders.value.filter((o) => o.status === selectedStatus.value);
});

const completedOrders = computed(() => {
  console.log("Computing completed orders from:", orders.myOrders);
  // For now, let's show ALL orders in history, not just completed ones
  let filtered = orders.myOrders; // Show all orders instead of just completed
  console.log("All orders for history:", filtered);

  if (selectedTimeFilter.value === "week") {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((o) => o.createdAt > weekAgo);
  } else if (selectedTimeFilter.value === "month") {
    const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((o) => o.createdAt > monthAgo);
  }

  return filtered.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
});

// Add a separate computed for actually completed orders for statistics
const trulyCompletedOrders = computed(() => {
  return orders.myOrders.filter((o) => o.status === "completed");
});

const filteredCompletedOrders = computed(() => {
  if (!selectedStatus.value) return completedOrders.value;
  return completedOrders.value.filter((o) => o.status === selectedStatus.value);
});

// Order statistics
const orderStats = computed(() => ({
  total: orders.myOrders.length,
  completed: trulyCompletedOrders.value.length,
  active: activeOrders.value.length,
  thisWeek: orders.myOrders.filter((o) => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return o.createdAt > weekAgo;
  }).length,
}));

onMounted(() => {
  const auth = useAuthStore();
  console.log("Auth state on mount:", {
    userRole: auth.userRole,
    lrnOrName: auth.lrnOrName,
    displayName: auth.displayName,
    isAuthenticated: auth.isAuthenticated,
  });
  orders.initStudent();
});

// Add watchers to debug the data
watch(
  () => orders.myOrders,
  (newOrders) => {
    console.log("Orders updated:", newOrders);
    console.log("Active orders:", activeOrders.value);
    console.log("Completed orders:", completedOrders.value);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h2 class="font-poppins text-3xl font-bold text-gray-800 mb-2">
        Your Orders
      </h2>
      <p class="text-gray-600">Track your order history and current status</p>

      <!-- Order Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white rounded-lg p-4 border border-gray-100">
          <div class="text-2xl font-bold text-maroon">
            {{ orderStats.total }}
          </div>
          <div class="text-sm text-gray-600">Total Orders</div>
        </div>
        <div
          class="bg-white rounded-lg p-4 border border-gray-100 cursor-pointer"
          @click="toggleStatusFilter('completed')"
        >
          <div class="text-2xl font-bold text-green-600">
            {{ orderStats.completed }}
          </div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
        <div
          class="bg-white rounded-lg p-4 border border-gray-100 cursor-pointer"
          @click="toggleStatusFilter('pending')"
        >
          <div class="text-2xl font-bold text-blue-600">
            {{ orderStats.active }}
          </div>
          <div class="text-sm text-gray-600">Active Orders</div>
        </div>
        <div class="bg-white rounded-lg p-4 border border-gray-100">
          <div class="text-2xl font-bold text-amber-600">
            {{ orderStats.thisWeek }}
          </div>
          <div class="text-sm text-gray-600">This Week</div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'active'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="
              activeTab === 'active'
                ? 'border-maroon text-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
          >
            Active Orders
            <span
              v-if="activeOrders.length > 0"
              class="ml-2 bg-maroon text-white text-xs rounded-full px-2 py-1"
            >
              {{ activeOrders.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'history'"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="
              activeTab === 'history'
                ? 'border-maroon text-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
          >
            All Order History
            <span
              v-if="completedOrders.length > 0"
              class="ml-2 bg-gray-500 text-white text-xs rounded-full px-2 py-1"
            >
              {{ completedOrders.length }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Time Filter for History Tab -->
    <div v-if="activeTab === 'history'" class="mb-6">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700">Filter by:</label>
        <select
          v-model="selectedTimeFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon/20 focus:border-maroon text-sm"
        >
          <option value="all">All Time</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>
      </div>
    </div>

    <!-- Active Orders Tab -->
    <div v-if="activeTab === 'active'">
      <div class="mb-3 text-sm text-gray-500">
        <template v-if="selectedStatus">
          Showing <strong>{{ selectedStatus }}</strong> orders —
          <button class="underline" @click="toggleStatusFilter(null)">
            Clear filter
          </button>
        </template>
      </div>
      <div v-if="activeOrders.length === 0" class="text-center py-16">
        <div
          class="bg-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-blue-500"
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
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No active orders
        </h3>
        <p class="text-gray-500 mb-6">
          You don't have any pending or confirmed orders at the moment
        </p>
        <NuxtLink
          to="/student"
          class="inline-flex items-center gap-2 px-6 py-3 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          Browse Menu
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="o in filteredActiveOrders"
          :key="o.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <!-- Use existing order card template -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-maroon/10 rounded-lg">
                  <svg
                    class="w-5 h-5 text-maroon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ o.slot }}</h3>
                  <p class="text-sm text-gray-500">
                    {{
                      new Date(o.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm text-gray-600">Status:</span>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-amber-100 text-amber-800': o.status === 'confirmed',
                      'bg-blue-100 text-blue-800': o.status === 'pending',
                    }"
                  >
                    {{ o.status.charAt(0).toUpperCase() + o.status.slice(1) }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500">Claim Code:</span>
                  <div
                    class="font-mono text-lg font-bold text-maroon bg-maroon/10 px-3 py-1 rounded-lg inline-block"
                  >
                    {{ o.claimCode }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
            <div class="space-y-3">
              <div
                v-for="item in o.items"
                :key="item.id"
                class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-maroon rounded-full"></div>
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                </div>
                <span class="text-sm text-gray-600"
                  >Qty: {{ item.quantity }}</span
                >
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800">Total Items:</span>
                <span class="text-xl font-bold text-maroon"
                  >{{
                    o.items.reduce((sum, item) => sum + item.quantity, 0)
                  }}
                  items</span
                >
              </div>
            </div>
          </div>
          <!-- Status indicators -->
          <div
            v-if="o.status === 'pending'"
            class="px-6 py-3 bg-blue-50 border-t border-blue-100"
          >
            <div class="flex items-center gap-2 text-blue-700">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
              <span class="text-sm font-medium"
                >Your order is being prepared...</span
              >
            </div>
          </div>
          <div
            v-else-if="o.status === 'confirmed'"
            class="px-6 py-3 bg-amber-50 border-t border-amber-100"
          >
            <div class="flex items-center gap-2 text-amber-700">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="text-sm font-medium"
                >Ready for pickup! Present your claim code at the counter.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order History Tab -->
    <div v-if="activeTab === 'history'">
      <div class="mb-3 text-sm text-gray-500">
        <template v-if="selectedStatus">
          Showing <strong>{{ selectedStatus }}</strong> orders —
          <button class="underline" @click="toggleStatusFilter(null)">
            Clear filter
          </button>
        </template>
      </div>
      <div v-if="completedOrders.length === 0" class="text-center py-16">
        <div
          class="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          No orders found
        </h3>
        <p class="text-gray-500 mb-6">
          You haven't placed any orders yet. Start by browsing our menu!
        </p>
        <NuxtLink
          to="/student"
          class="inline-flex items-center gap-2 px-6 py-3 bg-maroon text-white rounded-lg hover:bg-maroon/90 transition-colors"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          Browse Menu
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="o in filteredCompletedOrders"
          :key="o.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="p-2 rounded-lg"
                  :class="{
                    'bg-blue-100': o.status === 'pending',
                    'bg-amber-100': o.status === 'confirmed',
                    'bg-green-100': o.status === 'completed',
                  }"
                >
                  <svg
                    class="w-5 h-5"
                    :class="{
                      'text-blue-600': o.status === 'pending',
                      'text-amber-600': o.status === 'confirmed',
                      'text-green-600': o.status === 'completed',
                    }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="o.status === 'pending'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                    <path
                      v-else-if="o.status === 'confirmed'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">{{ o.slot }}</h3>
                  <p class="text-sm text-gray-500">
                    {{
                      new Date(o.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': o.status === 'pending',
                    'bg-amber-100 text-amber-800': o.status === 'confirmed',
                    'bg-green-100 text-green-800': o.status === 'completed',
                  }"
                >
                  {{ o.status.charAt(0).toUpperCase() + o.status.slice(1) }}
                </span>
                <div class="text-right mt-1">
                  <span class="text-xs text-gray-500">Claim Code:</span>
                  <div
                    class="font-mono text-sm font-bold px-2 py-1 rounded inline-block"
                    :class="{
                      'text-maroon bg-maroon/10':
                        o.status === 'pending' || o.status === 'confirmed',
                      'text-gray-600 bg-gray-100': o.status === 'completed',
                    }"
                  >
                    {{ o.claimCode }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
            <div class="space-y-2">
              <div
                v-for="item in o.items"
                :key="item.id"
                class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-blue-500': o.status === 'pending',
                      'bg-amber-500': o.status === 'confirmed',
                      'bg-green-500': o.status === 'completed',
                    }"
                  ></div>
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                </div>
                <span class="text-sm text-gray-600"
                  >Qty: {{ item.quantity }}</span
                >
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800">Total Items:</span>
                <span
                  class="text-xl font-bold"
                  :class="{
                    'text-blue-600': o.status === 'pending',
                    'text-amber-600': o.status === 'confirmed',
                    'text-green-600': o.status === 'completed',
                  }"
                >
                  {{ o.items.reduce((sum, item) => sum + item.quantity, 0) }}
                  items
                </span>
              </div>
            </div>
            <div
              v-if="o.status === 'completed'"
              class="mt-3 pt-3 border-t border-gray-200"
            >
              <div class="flex items-center gap-2 text-green-600">
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
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span class="text-sm font-medium"
                  >Order completed successfully</span
                >
              </div>
            </div>
            <div
              v-else-if="o.status === 'confirmed'"
              class="mt-3 pt-3 border-t border-gray-200"
            >
              <div class="flex items-center gap-2 text-amber-600">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span class="text-sm font-medium">Ready for pickup</span>
              </div>
            </div>
            <div v-else class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center gap-2 text-blue-600">
                <svg
                  class="w-4 h-4 animate-spin"
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
                <span class="text-sm font-medium">Order being prepared</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
