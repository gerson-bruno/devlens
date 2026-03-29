<template>
  <div class="box">
    <div class="input-wrapper">
      <input v-model="localToken" placeholder="Token GitHub (opcional)" />
      
      <div class="help-icon" data-tooltip="Para evitar o limite de busca da API. Crie um TOKEN em: Settings > Developer Settings > Personal access tokens. (PS: Para utilizar essa função é necessário ser membro do programa de desenvolvedores do GitHub.)">
        ?
      </div>
    </div>
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
};
</script>

<style scoped>
.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

input {
  width: 100%;
  background: #0d1117;
  border: 1px solid #30363d;
  padding: 10px 35px 10px 14px; /* Espaço na direita para o ícone */
  border-radius: 6px;
  color: #f0f6fc;
  font-size: 0.9rem;
}

.help-icon {
  position: absolute;
  right: 10px;
  width: 18px;
  height: 18px;
  background: #30363d;
  color: #8b949e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: help;
  transition: 0.2s;
}

.help-icon:hover {
  background: #58a6ff;
  color: #fff;
}

/* Estilo do Tooltip (Balão de ajuda) */
.help-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 130%;
  right: 0;
  width: 200px;
  padding: 10px;
  background: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
  font-size: 11px;
  border-radius: 6px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 5px 15px rgba(0,0,0,0.4);
  z-index: 10;
  line-height: 1.4;
  pointer-events: none;
}

.help-icon:hover::after {
  visibility: visible;
  opacity: 1;
}
</style>