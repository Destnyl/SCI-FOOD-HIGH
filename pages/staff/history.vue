<script setup lang="ts">
definePageMeta({
  middleware: "auth-staff",
  layout: "staff",
});

const orders = useOrdersStore();
onMounted(() => orders.initStaff());
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Order History</h2>
    <div class="space-y-3">
      <div
        v-for="o in orders.completedOrders"
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
        </div>
        <ul class="mt-2 list-disc list-inside text-sm">
          <li v-for="li in o.items" :key="li.id">
            {{ li.name }} x{{ li.quantity }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
