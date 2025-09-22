<script setup lang="ts">
definePageMeta({
  middleware: "auth-student",
  layout: "student",
});

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
  <div class="p-6">
    <div class="mb-8">
      <h2 class="font-poppins text-3xl font-bold text-gray-800 mb-2">
        Today's Menu
      </h2>
      <p class="text-gray-600">
        Discover delicious meals crafted with care for our students
      </p>
    </div>

    <div v-if="menu.items.length === 0" class="text-center py-16">
      <div
        class="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">
        No Menu Items Available
      </h3>
      <p class="text-gray-500">
        Check back later for today's delicious offerings!
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="item in menu.items"
        :key="item.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div class="relative overflow-hidden">
          <div v-if="item.imageUrl" class="aspect-square">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div
            v-else
            class="aspect-square bg-gradient-to-br from-maroon/10 to-maroon/20 flex items-center justify-center"
          >
            <svg
              class="w-16 h-16 text-maroon/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div class="absolute top-3 right-3">
            <div
              class="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm"
            >
              <span class="text-sm font-bold text-maroon"
                >₱{{ item.price.toFixed(2) }}</span
              >
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-gray-800 mb-2">{{ item.name }}</h3>
          <button
            class="w-full mt-3 px-4 py-3 rounded-lg bg-maroon text-white font-medium hover:bg-maroon/90 focus:ring-4 focus:ring-maroon/20 transition-all duration-200 flex items-center justify-center gap-2 group"
            @click="addToCartAndNotify(item)"
          >
            <svg
              class="w-4 h-4 group-hover:scale-110 transition-transform"
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
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
