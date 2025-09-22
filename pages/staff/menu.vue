<script setup lang="ts">
definePageMeta({
  middleware: "auth-staff",
  layout: "staff",
});

const menu = useMenuStore();
const name = ref("");
const price = ref<number | null>(null);
const imageFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadError = ref("");

onMounted(() => menu.init());

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    imageFile.value = target.files[0];
  } else {
    imageFile.value = null;
  }
}

async function addItem() {
  if (!name.value || price.value == null) return;

  try {
    isUploading.value = true;
    uploadError.value = "";

    await menu.addItem({
      name: name.value,
      price: Number(price.value),
      imageFile: imageFile.value || undefined,
    });

    // Reset form
    name.value = "";
    price.value = null;
    imageFile.value = null;

    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  } catch (error) {
    console.error("Error adding item:", error);
    uploadError.value = "Failed to add menu item. Please try again.";
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div>
    <h2 class="font-poppins text-2xl font-semibold mb-4">Manage Menu</h2>

    <!-- Error message -->
    <div
      v-if="uploadError"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ uploadError }}
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="font-semibold text-lg text-gray-800 mb-4">
        Add New Menu Item
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Item Name</label
          >
          <div class="relative">
            <input
              v-model="name"
              :disabled="isUploading"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              placeholder="e.g., Chicken Sandwich"
            />
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Price (PHP)</label
          >
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium"
              >₱</span
            >
            <input
              type="number"
              step="0.01"
              v-model="price"
              :disabled="isUploading"
              class="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              placeholder="0.00"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Image</label
          >
          <div class="relative">
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              :disabled="isUploading"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-maroon focus:ring-4 focus:ring-maroon/10 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-maroon file:text-white hover:file:bg-maroon/90 file:cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          class="px-6 py-3 rounded-lg bg-maroon text-white font-semibold hover:bg-maroon/90 focus:ring-4 focus:ring-maroon/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          @click="addItem"
          :disabled="isUploading || !name || price === null"
        >
          <svg
            v-if="isUploading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isUploading ? "Adding..." : "Add Menu Item" }}
        </button>
      </div>
    </div>
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
          class="mt-3 px-3 py-1 rounded bg-burnt text-white"
          @click="menu.removeItem(item.id)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
