<template>
  <div class="box">
    <input v-model="username" placeholder="Digite um usuário do GitHub" @keyup.enter="search" />
    <button @click="search">Analisar</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const emit = defineEmits(["search"]);

const search = () => {
  if (!username.value) return;
  emit("search", username.value);
};
</script>