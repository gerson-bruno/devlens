<template>
  <div class="box">
    <input v-model="localToken" placeholder="Token GitHub (opcional)" />
    <button @click="save">Salvar</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { setToken } from "../services/github";

const localToken = ref("");

onMounted(() => {
  const saved = localStorage.getItem("gh_token");
  if (saved) {
    localToken.value = saved;
    setToken(saved);
  }
});

const save = () => {
  const t = localToken.value.trim();
  localStorage.setItem("gh_token", t);
  setToken(t);
  // Removi o alert para uma UX mais fluida, mas você pode manter se preferir
};
</script>