<script setup lang="ts">
import { onMounted } from 'vue'
import { useOrdersStore } from '../../stores/orders'

const orders = useOrdersStore()
onMounted(() => orders.initStaff())
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Staff Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded shadow p-4">
        <div class="text-sm text-maroon/70">Pending Orders</div>
        <div class="text-3xl font-bold">{{ orders.pendingCount }}</div>
      </div>
      <div class="bg-white rounded shadow p-4">
        <div class="text-sm text-maroon/70">Confirmed Today</div>
        <div class="text-3xl font-bold">{{ orders.confirmedToday }}</div>
      </div>
      <div class="bg-white rounded shadow p-4">
        <div class="text-sm text-maroon/70">Completed Today</div>
        <div class="text-3xl font-bold">{{ orders.completedToday }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

