<template>
  <div class="card">
    <p>{{ title }}</p>
    <h2>{{ value }}</h2>
  </div>
</template>

<script setup>
defineProps(["title", "value"]);
</script>