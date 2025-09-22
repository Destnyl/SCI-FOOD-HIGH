<script setup lang="ts">
definePageMeta({
  middleware: "auth-staff",
  layout: "staff",
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
