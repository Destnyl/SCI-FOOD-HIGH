<script setup lang="ts">
definePageMeta({
  middleware: "auth-student",
  layout: "student",
});

const cart = useCartStore();
const orders = useOrdersStore();
const { success } = useNotification();
const slot = ref<"AM Recess" | "Lunch" | "PM Recess">("AM Recess");

const total = computed(() =>
  cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0)
);

async function placeOrder() {
  if (cart.items.length === 0) return;
  const claimCode = await orders.placeOrder(cart.items, slot.value);
  cart.clear();
  success(
    "Order Placed Successfully!",
    `Your claim code is: ${claimCode}. Please save this code to collect your order.`,
    { duration: 8000 }
  );
}
</script>

<template>
  <div class="p-6">
    <div class="mb-8">
      <h2 class="font-poppins text-3xl font-bold text-gray-800 mb-2">
        Your Cart
      </h2>
      <p class="text-gray-600">
        Review your selected items before placing your order
      </p>
    </div>

    <div v-if="cart.items.length === 0" class="text-center py-16">
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v5a2 2 0 002 2h7.5"
          ></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">
        Your cart is empty
      </h3>
      <p class="text-gray-500 mb-6">
        Add some delicious items from our menu to get started!
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
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          ></path>
        </svg>
        Browse Menu
      </NuxtLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Cart Items -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">Order Items</h3>
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="it in cart.items"
            :key="it.id"
            class="p-6 flex items-center gap-4"
          >
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800">{{ it.name }}</h4>
              <p class="text-maroon font-medium">₱{{ it.price.toFixed(2) }}</p>
            </div>

            <div class="flex items-center gap-3">
              <div
                class="flex items-center bg-gray-50 rounded-lg border border-gray-200"
              >
                <button
                  class="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                  @click="cart.decrement(it.id)"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    ></path>
                  </svg>
                </button>
                <span
                  class="px-4 py-2 font-medium text-gray-800 bg-white border-x border-gray-200"
                  >{{ it.quantity }}</span
                >
                <button
                  class="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                  @click="cart.increment(it.id)"
                >
                  <svg
                    class="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </button>
              </div>

              <button
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                @click="cart.remove(it.id)"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>

            <div class="text-right min-w-[80px]">
              <p class="font-semibold text-gray-800">
                ₱{{ (it.price * it.quantity).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700 min-w-[100px]"
              >Pickup Slot:</label
            >
            <div class="flex-1">
              <select
                v-model="slot"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none"
              >
                <option value="AM Recess">AM Recess (9:00 - 9:30 AM)</option>
                <option value="Lunch">Lunch Time (12:00 - 1:00 PM)</option>
                <option value="PM Recess">PM Recess (3:00 - 3:30 PM)</option>
              </select>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">₱{{ total.toFixed(2) }}</span>
            </div>
            <div
              class="flex justify-between items-center text-lg font-bold text-gray-800"
            >
              <span>Total:</span>
              <span class="text-maroon">₱{{ total.toFixed(2) }}</span>
            </div>
          </div>

          <button
            class="w-full mt-6 px-6 py-4 rounded-lg bg-maroon text-white font-semibold hover:bg-maroon/90 focus:ring-4 focus:ring-maroon/20 transition-all duration-200 flex items-center justify-center gap-2"
            @click="placeOrder"
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
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Place Order - ₱{{ total.toFixed(2) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
