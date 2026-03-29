<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";

const props = defineProps(["data"]);
const canvas = ref(null);
let chart = null;

const render = () => {
  if (!props.data || Object.keys(props.data).length === 0) return;

  if (chart) chart.destroy();

  chart = new Chart(canvas.value, {
    type: "doughnut",
    data: {
      labels: Object.keys(props.data),
      datasets: [
        {
          data: Object.values(props.data)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

onMounted(render);
watch(() => props.data, render);
</script>