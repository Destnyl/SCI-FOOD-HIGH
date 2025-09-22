<script setup lang="ts">
import { onMounted } from "vue";
import { useMenuStore } from "../../stores/menu";
import { useCartStore } from "../../stores/cart";

const menu = useMenuStore();
const cart = useCartStore();
const { success } = useNotification();

function addToCartAndNotify(item: any) {
  cart.addToCart(item);
  success("Added to cart", `${item.name} has been added to your cart.`);
}

onMounted(() => menu.init());
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Today's Menu</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in menu.items"
        :key="item.id"
        class="bg-white rounded shadow p-4"
      >
        <div v-if="item.imageUrl" class="mb-2">
          <img
            :src="item.imageUrl"
            alt="Menu Image"
            class="w-full h-32 object-cover rounded"
          />
        </div>
        <div class="font-semibold">{{ item.name }}</div>
        <div class="text-sm text-maroon/70">₱{{ item.price.toFixed(2) }}</div>
        <button
          class="mt-3 px-3 py-1 rounded bg-maroon text-white"
          @click="addToCartAndNotify(item)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
