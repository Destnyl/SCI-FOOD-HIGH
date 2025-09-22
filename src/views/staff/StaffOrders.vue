<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const orders = useOrdersStore()
onMounted(() => orders.initStaff())
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Incoming Orders</h2>
    <div v-if="orders.allOrders.length === 0" class="text-maroon/70">No orders yet.</div>
    <div class="space-y-3">
      <div v-for="o in orders.allOrders" :key="o.id" class="bg-white rounded shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">{{ o.slot }} • Claim: <span class="font-bold">{{ o.claimCode }}</span></div>
            <div class="text-sm text-maroon/70">{{ new Date(o.createdAt).toLocaleString() }}</div>
          </div>
          <div class="flex items-center gap-2">
            <button v-if="o.status==='pending'" class="px-3 py-1 bg-amber rounded" @click="orders.confirmOrder(o.id)">Confirm</button>
            <button v-if="o.status!=='completed'" class="px-3 py-1 bg-maroon text-white rounded" @click="orders.completeOrder(o.id)">Complete</button>
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

