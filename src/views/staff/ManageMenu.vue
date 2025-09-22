<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useMenuStore } from "../../stores/menu";

const menu = useMenuStore();
const name = ref("");
const price = ref<number | null>(null);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);
const errors = ref<{ name?: string; price?: string; image?: string }>({});

const formValid = computed(() => {
  return name.value.trim() && price.value !== null && price.value > 0;
});

onMounted(() => menu.init());

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    imageFile.value = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  } else {
    imageFile.value = null;
    imagePreview.value = null;
  }
}

function validateForm() {
  errors.value = {};
  if (!name.value.trim()) {
    errors.value.name = "Item name is required";
  }
  if (!price.value || price.value <= 0) {
    errors.value.price = "Price must be greater than 0";
  }
  return Object.keys(errors.value).length === 0;
}

async function addItem() {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;
    await menu.addItem({
      name: name.value,
      price: Number(price.value),
      imageFile: imageFile.value || undefined,
    });
    name.value = "";
    price.value = null;
    imageFile.value = null;
    imagePreview.value = null;
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  } catch (error) {
    console.error("Failed to add item:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="font-poppins text-3xl font-bold mb-6 text-gray-800">
      Manage Menu
      <span class="text-sm font-normal text-gray-500 ml-2">
        {{ menu.items.length }} items
      </span>
    </h2>

    <!-- Add Item Form -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h3 class="text-xl font-semibold mb-4 text-gray-700">Add New Item</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700"
              >Item Name</label
            >
            <input
              v-model="name"
              class="w-full rounded-md border-2 border-gray-200 p-2 focus:border-maroon focus:ring-1 focus:ring-maroon transition-colors"
              :class="{ 'border-red-300': errors.name }"
              placeholder="e.g., Chicken Sandwich"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700"
              >Price (PHP)</label
            >
            <input
              type="number"
              step="0.01"
              v-model="price"
              class="w-full rounded-md border-2 border-gray-200 p-2 focus:border-maroon focus:ring-1 focus:ring-maroon transition-colors"
              :class="{ 'border-red-300': errors.price }"
              placeholder="0.00"
            />
            <p v-if="errors.price" class="mt-1 text-sm text-red-500">
              {{ errors.price }}
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700"
              >Image</label
            >
            <div class="relative">
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="hidden"
                id="food-image"
              />
              <label
                for="food-image"
                class="cursor-pointer flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-maroon transition-colors"
              >
                <div v-if="!imagePreview" class="text-center">
                  <i class="fas fa-upload text-gray-400 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-500">Click to upload image</p>
                </div>
                <img
                  v-else
                  :src="imagePreview"
                  class="w-full h-full object-cover rounded-lg"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="px-6 py-2 rounded-md bg-maroon text-white font-medium hover:bg-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          @click="addItem"
          :disabled="!formValid || isSubmitting"
        >
          <span v-if="isSubmitting">Adding...</span>
          <span v-else>Add Item</span>
        </button>
      </div>
    </div>

    <!-- Menu Items Grid -->
    <div v-if="menu.items.length > 0" class="space-y-8">
      <!-- Grid Header -->
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-700">Menu Items</h3>
        <div class="flex gap-4">
          <button class="text-gray-500 hover:text-gray-700 transition-colors">
            <i class="fas fa-th-large"></i>
          </button>
          <button class="text-gray-500 hover:text-gray-700 transition-colors">
            <i class="fas fa-list"></i>
          </button>
        </div>
      </div>

      <!-- Menu Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
      >
        <div
          v-for="item in menu.items"
          :key="item.id"
          class="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Image Container -->
          <div class="relative aspect-w-16 aspect-h-9 bg-gray-100">
            <img
              :src="
                item.imageUrl ||
                'https://via.placeholder.com/400x300?text=No+Image'
              "
              :alt="item.name"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <!-- Overlay with Actions -->
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <div class="flex gap-3">
                <button
                  class="p-2 rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all duration-300"
                  @click.stop="menu.removeItem(item.id)"
                  title="Remove item"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button
                  class="p-2 rounded-full bg-white text-blue-500 hover:bg-blue-500 hover:text-white transform hover:scale-110 transition-all duration-300"
                  title="Edit item"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3
                class="font-semibold text-lg text-gray-800 leading-tight group-hover:text-maroon transition-colors"
              >
                {{ item.name }}
              </h3>
              <span
                class="px-3 py-1 bg-maroon/10 text-maroon rounded-full text-sm font-medium"
              >
                ₱{{ item.price.toFixed(2) }}
              </span>
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <i class="fas fa-clock mr-2"></i>
              <span>Added recently</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
      <i class="fas fa-utensils text-4xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-medium text-gray-600">No menu items yet</h3>
      <p class="text-gray-500">
        Add your first menu item using the form above.
      </p>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Aspect Ratio Support */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* Grid Animation */
.grid {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth Card Transitions */
.group {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Price Tag Animation */
.group:hover .text-maroon {
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
