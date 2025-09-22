<script setup lang="ts">
definePageMeta({
  middleware: "auth-staff",
  layout: "staff",
});

const orders = useOrdersStore();
const selectedStatus = ref<null | string>(null);

function toggleStatusFilter(status: null | string) {
  selectedStatus.value = selectedStatus.value === status ? null : status;
}
const { success, info } = useNotification();

// Store for user emails fetched from Firebase Auth
const userEmails = ref<Record<string, string>>({});

// Function to get user email from Firebase Auth
async function fetchUserEmailFromAuth(identifier: string): Promise<string> {
  try {
    // Check if we already have the email cached
    if (userEmails.value[identifier]) {
      return userEmails.value[identifier];
    }

    // Import Firebase Auth functions
    const { getAuth } = await import("firebase/auth");
    const { $firebaseApp } = useNuxtApp();

    if ($firebaseApp) {
      const auth = getAuth($firebaseApp);

      // Generate the expected email format
      const expectedEmail = `${identifier}@scifood.local`;

      // For this implementation, we'll use the expected email since we can't directly
      // query Firebase Auth users (requires Admin SDK)
      userEmails.value[identifier] = expectedEmail;
      console.log(`Cached email for ${identifier}: ${expectedEmail}`);
      return expectedEmail;
    }

    // Fallback if Firebase is not available
    return `${identifier}@scifood.local`;
  } catch (error) {
    console.error("Error fetching user email:", error);
    return `${identifier}@scifood.local`;
  }
}

// Computed properties for filtering orders
const pendingOrders = computed(() =>
  ordersWithEmails.value.filter((o) => o.status === "pending")
);

const confirmedOrders = computed(() =>
  ordersWithEmails.value.filter((o) => o.status === "confirmed")
);

const completedOrders = computed(() =>
  ordersWithEmails.value.filter((o) => o.status === "completed")
);

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return ordersWithEmails.value;
  return ordersWithEmails.value.filter(
    (o) => o.status === selectedStatus.value
  );
});

// Enhanced confirm order function with notification
async function confirmOrder(orderId: string, claimCode: string) {
  await orders.confirmOrder(orderId);
  success(
    "Order Confirmed!",
    `Order ${claimCode} has been confirmed and is ready for pickup.`,
    { duration: 4000 }
  );
}

// Enhanced complete order function with notification
async function completeOrder(orderId: string, claimCode: string) {
  await orders.completeOrder(orderId);
  info("Order Completed!", `Order ${claimCode} has been marked as completed.`, {
    duration: 4000,
  });
}

// Function to get student email with fallback
async function getStudentEmail(order: any): Promise<string> {
  // First try to get from the order itself
  if (order.email && order.email !== "undefined") {
    return order.email;
  }

  // Try to fetch from Firebase Auth using identifier
  if (order.identifier) {
    return await fetchUserEmailFromAuth(order.identifier);
  }

  // Try to fetch using userId as fallback
  if (order.userId) {
    return await fetchUserEmailFromAuth(order.userId);
  }

  return "No email";
}

// Computed property to get emails for all orders
const ordersWithEmails = computed(() => {
  return orders.allOrders.map((order) => ({
    ...order,
    displayEmail:
      userEmails.value[order.identifier || order.userId] ||
      order.email ||
      `${order.identifier || order.userId}@scifood.local`,
  }));
});

onMounted(async () => {
  orders.initStaff();

  // Debug: Watch orders to see what data we're getting
  watch(
    () => orders.allOrders,
    async (newOrders) => {
      console.log("Staff orders updated:", newOrders);
      if (newOrders.length > 0) {
        console.log("First order structure:", newOrders[0]);
        console.log("First order email:", newOrders[0].email);
        console.log("First order identifier:", newOrders[0].identifier);

        // Pre-fetch emails for all orders
        for (const order of newOrders) {
          const identifier = order.identifier || order.userId;
          if (identifier && !userEmails.value[identifier]) {
            await fetchUserEmailFromAuth(identifier);
          }
        }
      }
    },
    { deep: true }
  );
});
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h2 class="font-poppins text-3xl font-bold text-gray-800 mb-2">
        Order Management
      </h2>
      <p class="text-gray-600">Manage incoming orders and track their status</p>

      <!-- Order Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div
          class="bg-white rounded-lg p-4 border border-gray-100 cursor-pointer"
          @click="toggleStatusFilter('pending')"
          :class="{ 'ring-2 ring-blue-200': selectedStatus === 'pending' }"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg
                class="w-5 h-5 text-blue-600"
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
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">
                {{ pendingOrders.length }}
              </div>
              <div class="text-sm text-gray-600">Pending Orders</div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg p-4 border border-gray-100 cursor-pointer"
          @click="toggleStatusFilter('confirmed')"
          :class="{ 'ring-2 ring-amber-200': selectedStatus === 'confirmed' }"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-100 rounded-lg">
              <svg
                class="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-amber-600">
                {{ confirmedOrders.length }}
              </div>
              <div class="text-sm text-gray-600">Ready for Pickup</div>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-lg p-4 border border-gray-100 cursor-pointer"
          @click="toggleStatusFilter('completed')"
          :class="{ 'ring-2 ring-green-200': selectedStatus === 'completed' }"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg
                class="w-5 h-5 text-green-600"
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
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">
                {{ completedOrders.length }}
              </div>
              <div class="text-sm text-gray-600">Completed Today</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-if="orders.allOrders.length === 0" class="text-center py-16">
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
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
      <p class="text-gray-500">
        New orders will appear here when students place them.
      </p>
    </div>

    <div v-else class="space-y-4">
      <div class="mb-3 text-sm text-gray-500">
        <template v-if="selectedStatus">
          Showing <strong>{{ selectedStatus }}</strong> orders —
          <button class="underline" @click="toggleStatusFilter(null)">
            Clear filter
          </button>
        </template>
      </div>

      <div
        v-for="o in filteredOrders"
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
                  {{ new Date(o.createdAt).toLocaleString() }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <svg
                    class="w-4 h-4 text-blue-500"
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
                  <span class="text-sm font-medium text-blue-700">
                    Student Email: {{ o.displayEmail }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
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
                <div class="mt-1">
                  <span class="text-xs text-gray-500">Claim Code:</span>
                  <div
                    class="font-mono text-lg font-bold text-maroon bg-maroon/10 px-3 py-1 rounded-lg inline-block"
                  >
                    {{ o.claimCode }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <!-- Confirm button: Only shows for pending orders -->
                <button
                  v-if="o.status === 'pending'"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center gap-2"
                  @click="confirmOrder(o.id, o.claimCode)"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Confirm Order
                </button>

                <!-- Complete button: Only shows for confirmed orders -->
                <button
                  v-if="o.status === 'confirmed'"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm flex items-center gap-2"
                  @click="completeOrder(o.id, o.claimCode)"
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Mark as Complete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-medium text-gray-700">Order Details</h4>
            <div class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <span class="font-medium text-blue-700"
                >Student Email: {{ o.displayEmail }}</span
              >
            </div>
          </div>

          <h5 class="text-sm font-medium text-gray-600 mb-2">Items Ordered:</h5>
          <div class="space-y-2 mb-4">
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
        </div>
      </div>
    </div>
  </div>
</template>
