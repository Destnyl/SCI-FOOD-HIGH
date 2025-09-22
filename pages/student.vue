<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "student",
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
