<script setup lang="ts">
definePageMeta({
  middleware: "auth-student",
  layout: "student",
});

const orders = useOrdersStore();
import { useMenuStore } from "~/stores/menu";
const menu = useMenuStore();
onMounted(() => menu.init());
onMounted(() => orders.initStudent());

// Get completed orders for the current student
const completedStudentOrders = computed(() =>
  orders.myOrders.filter((o) => o.status === "completed")
);
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Order History</h2>
    <div class="space-y-3">
      <div
        v-if="completedStudentOrders.length === 0"
        class="bg-white rounded shadow p-6 text-center text-maroon/70"
      >
        <svg
          class="w-12 h-12 mx-auto mb-3 text-maroon/40"
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
        <p class="font-medium">No completed orders yet</p>
        <p class="text-sm mt-1">Your completed orders will appear here</p>
      </div>
      <div
        v-for="o in completedStudentOrders"
        :key="o.id"
        class="bg-white rounded shadow p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">
              {{ o.slot }} • Claim:
              <span class="font-bold">{{ o.claimCode }}</span>
            </div>
            <div class="text-sm text-maroon/70">
              {{ new Date(o.createdAt).toLocaleString() }}
            </div>
          </div>
          <div class="flex items-center text-green-600">
            <svg
              class="w-5 h-5 mr-1"
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
            <span class="text-sm font-medium">Completed</span>
          </div>
        </div>
        <ul class="mt-2 list-disc list-inside text-sm">
          <li v-for="li in o.items" :key="li.id">
            {{ li.name }} - ₱{{
              menu.items.find((m) => m.id === li.id)?.price ?? "N/A"
            }}
            x{{ li.quantity }}
          </li>
        </ul>
        <div class="mt-2 text-right text-green-700 font-bold">
          Total: ₱{{
            o.items.reduce((sum, item) => {
              const price =
                menu.items.find((m) => m.id === item.id)?.price ?? 0;
              return sum + price * item.quantity;
            }, 0)
          }}
        </div>
      </div>
    </div>
  </div>
</template>
