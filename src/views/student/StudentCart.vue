<script setup lang="ts">
import { computed, ref } from "vue";
import { useCartStore } from "../../stores/cart";
import { useOrdersStore } from "../../stores/orders";
import { showSuccess } from "../../../utils/notifications";

const cart = useCartStore();
const orders = useOrdersStore();
const slot = ref<"AM Recess" | "Lunch" | "PM Recess">("AM Recess");

const total = computed(() =>
  cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0)
);

async function placeOrder() {
  if (cart.items.length === 0) return;
  const claimCode = await orders.placeOrder(cart.items, slot.value);
  cart.clear();

  showSuccess(
    "Order Placed Successfully!",
    `Your claim code is: ${claimCode}. Please save this code to collect your order.`,
    { duration: 8000 }
  );
}
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Your Cart</h2>
    <div v-if="cart.items.length === 0" class="text-maroon/70">
      Cart is empty.
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="it in cart.items"
        :key="it.id"
        class="bg-white rounded shadow p-3 flex items-center justify-between"
      >
        <div>
          <div class="font-medium">{{ it.name }}</div>
          <div class="text-sm text-maroon/70">₱{{ it.price.toFixed(2) }}</div>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-2 py-1 bg-amber rounded"
            @click="cart.decrement(it.id)"
          >
            -
          </button>
          <span>{{ it.quantity }}</span>
          <button
            class="px-2 py-1 bg-amber rounded"
            @click="cart.increment(it.id)"
          >
            +
          </button>
          <button
            class="ml-2 px-2 py-1 bg-burnt text-white rounded"
            @click="cart.remove(it.id)"
          >
            Remove
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded shadow p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <label class="font-medium">Pickup Slot:</label>
          <select v-model="slot" class="rounded border-maroon/20">
            <option>AM Recess</option>
            <option>Lunch</option>
            <option>PM Recess</option>
          </select>
        </div>
        <div class="font-semibold">Total: ₱{{ total.toFixed(2) }}</div>
        <button
          class="px-4 py-2 rounded bg-maroon text-white"
          @click="placeOrder"
        >
          Place Order
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
