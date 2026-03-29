<template>
  <div class="card">
    <h3>Insights</h3>
    <ul>
      <li v-for="(item, i) in insights" :key="i">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps(["insights"]);
</script>