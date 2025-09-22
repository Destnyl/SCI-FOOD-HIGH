<script setup lang="ts">
// Set the page title and favicon
useHead({
  title: "SCI-FOOD-HIGH - School Food Ordering System",
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/school_logo.png",
    },
  ],
  meta: [
    {
      name: "description",
      content:
        "School Food Ordering System - Order ahead and skip the line. Fresh menus daily.",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NotificationContainer />
</template>
