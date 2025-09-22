<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const orders = useOrdersStore()
onMounted(() => orders.initStudent())
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Your Orders</h2>
    <div v-if="orders.myOrders.length === 0" class="text-maroon/70">No orders yet.</div>
    <div class="space-y-3">
      <div v-for="o in orders.myOrders" :key="o.id" class="bg-white rounded shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">{{ o.slot }} • Claim: <span class="font-bold">{{ o.claimCode }}</span></div>
            <div class="text-sm text-maroon/70">{{ new Date(o.createdAt).toLocaleString() }}</div>
          </div>
          <div class="text-sm">
            <span :class="o.status === 'completed' ? 'text-green-700' : o.status === 'confirmed' ? 'text-amber-700' : 'text-maroon'">{{ o.status }}</span>
          </div>
        </div>
        <ul class="mt-2 list-disc list-inside text-sm">
          <li v-for="li in o.items" :key="li.id">{{ li.name }} x{{ li.quantity }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

