<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none"
    >
      <TransitionGroup name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto transform transition-all duration-300 ease-in-out"
          :class="getNotificationClasses(notification.type)"
        >
          <div
            class="flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <!-- Success Icon -->
              <svg
                v-if="notification.type === 'success'"
                class="w-5 h-5 text-green-400"
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
              <!-- Error Icon -->
              <svg
                v-else-if="notification.type === 'error'"
                class="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <!-- Warning Icon -->
              <svg
                v-else-if="notification.type === 'warning'"
                class="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
              <!-- Info Icon -->
              <svg
                v-else
                class="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p
                class="font-semibold text-sm"
                :class="getTitleClasses(notification.type)"
              >
                {{ notification.title }}
              </p>
              <p
                v-if="notification.message"
                class="text-sm opacity-90 mt-1"
                :class="getMessageClasses(notification.type)"
              >
                {{ notification.message }}
              </p>
            </div>

            <!-- Close Button -->
            <button
              class="flex-shrink-0 p-1 rounded-full transition-colors duration-200"
              :class="getCloseButtonClasses(notification.type)"
              @click="removeNotification(notification.id)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { notifications, removeNotification } = useNotification();

const getNotificationClasses = (type: string) => {
  const baseClasses = "border-l-4";
  switch (type) {
    case "success":
      return `${baseClasses} bg-green-50/95 border-l-green-400`;
    case "error":
      return `${baseClasses} bg-red-50/95 border-l-red-400`;
    case "warning":
      return `${baseClasses} bg-yellow-50/95 border-l-yellow-400`;
    case "info":
    default:
      return `${baseClasses} bg-blue-50/95 border-l-blue-400`;
  }
};

const getTitleClasses = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-800";
    case "error":
      return "text-red-800";
    case "warning":
      return "text-yellow-800";
    case "info":
    default:
      return "text-blue-800";
  }
};

const getMessageClasses = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-700";
    case "error":
      return "text-red-700";
    case "warning":
      return "text-yellow-700";
    case "info":
    default:
      return "text-blue-700";
  }
};

const getCloseButtonClasses = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-600 hover:bg-green-100";
    case "error":
      return "text-red-600 hover:bg-red-100";
    case "warning":
      return "text-yellow-600 hover:bg-yellow-100";
    case "info":
    default:
      return "text-blue-600 hover:bg-blue-100";
  }
};
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
