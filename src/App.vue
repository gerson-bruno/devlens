<template>
  <div class="container">
    <h1>DevLens - GitHub Analyzer</h1>

    <div class="search-area">
      <TokenInput />
      <Search @search="fetchData" />
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Analisando repositórios...</p>
    </div>

    <div v-if="user && !loading" class="content">
      
      <div class="profile">
        <img :src="user.avatar_url" :alt="user.login" />
        <div class="info">
          <h2>{{ user.login }}</h2>
          <p>{{ user.name || 'Sem nome definido' }} 💻</p>
        </div>
      </div>

      <div class="stats">
        <div class="card">
          <span>Repositórios 📂</span>
          <strong>{{ repos.length }}</strong>
        </div>
        <div class="card">
          <span>Stars ⭐</span>
          <strong>{{ totalStars }}</strong>
        </div>
        <div class="card">
          <span>Score 🔥</span>
          <strong>{{ score }}%</strong>
        </div>
      </div>

      <div class="dashboard">
        <div class="chart-container">
          <canvas ref="canvas"></canvas>
        </div>
        
        <ul class="languages-list">
          <li v-for="(v, k) in languages" :key="k">
            <span class="dot" :style="{ backgroundColor: getLangColor(k) }"></span>
            <span class="lang-name">{{ k }}</span>
            <span class="lang-perc">{{ v }}%</span>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import Chart from "chart.js/auto";
import TokenInput from "./components/TokenInput.vue";
import Search from "./components/SearchBar.vue";

import { getUser, getRepos, getRepoLanguages } from "./services/github";

// Estados
const user = ref(null);
const repos = ref([]);
const languages = ref({});
const loading = ref(false);
const totalStars = ref(0);
const score = ref(0);

const canvas = ref(null);
let chart = null;

// Lógica de Busca
const fetchData = async (username) => {
  loading.value = true;
  user.value = null; 
  repos.value = [];
  languages.value = {};

  try {
    const [userRes, reposRes] = await Promise.all([
      getUser(username),
      getRepos(username)
    ]);

    user.value = userRes.data;
    repos.value = reposRes.data;

    await analyze();

  
    loading.value = false; 
    await nextTick(); 
    
    renderChart();
  } catch (e) {
    console.error(e);
    alert("Usuário não encontrado ou limite da API atingido.");
    loading.value = false;
  }
};

const analyze = async () => {
  let langMap = {};
  let stars = 0;

  for (const repo of repos.value.slice(0, 10)) {
    try {
      const res = await getRepoLanguages(repo.languages_url);
      const data = res.data;
      for (const lang in data) {
        langMap[lang] = (langMap[lang] || 0) + data[lang];
      }
    } catch {}
    stars += repo.stargazers_count;
  }

  const total = Object.values(langMap).reduce((a, b) => a + b, 0);
  for (let k in langMap) {
    langMap[k] = ((langMap[k] / total) * 100).toFixed(1);
  }

  languages.value = langMap;
  totalStars.value = stars;
  score.value = Math.min(100, (repos.value.length * 2) + (stars * 5));
};

// Cores Dinâmicas para Linguagens
const getLangColor = (lang) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Vue: "#41b883",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",      
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Go: "#00ADD8",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Rust: "#dea584"
  };
  return colors[lang] || "#8b949e";
};

const renderChart = () => {
  if (!canvas.value) return;
  if (chart) chart.destroy();

  chart = new Chart(canvas.value, {
    type: "doughnut",
    data: {
      labels: Object.keys(languages.value),
      datasets: [{
        data: Object.values(languages.value),
        backgroundColor: Object.keys(languages.value).map(getLangColor),
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
};
</script>

<style>
/* Reset e Base */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background-color: #0d1117;
  color: #c9d1d9;
  font-family: 'Inter', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}

h1 {
  font-size: 2.5rem;
  text-align: center;
  background: linear-gradient(90deg, #58a6ff, #bc8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
  font-weight: 800;
}

/* Área de Busca */
.search-area {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .search-area { flex-direction: column; }
}

/* Profile Section */
.profile {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #161b22;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #30363d;
  margin-bottom: 20px;
}

.profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #30363d;
}

.profile h2 { color: #f0f6fc; margin-bottom: 4px; }
.profile p { color: #8b949e; }

/* Stats Cards */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.card {
  background: #161b22;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #30363d;
  text-align: center;
}

.card span {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #8b949e;
  letter-spacing: 1px;
}

.card strong {
  display: block;
  font-size: 1.8rem;
  color: #58a6ff;
  margin-top: 8px;
}

/* Dashboard Layout */
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: #161b22;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #30363d;
}

@media (max-width: 600px) {
  .dashboard { grid-template-columns: 1fr; }
}

.chart-container { height: 250px; position: relative; }

.languages-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.languages-list li {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 12px;
}

.lang-name { flex: 1; color: #c9d1d9; }
.lang-perc { font-weight: bold; color: #8b949e; }

/* Loading Spinner */
.loading-state {
  text-align: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(88, 166, 255, 0.1);
  border-top: 4px solid #58a6ff;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.content {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>