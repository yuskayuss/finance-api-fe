<template>
  <div>
    <h2>Laporan Bulanan: {{ report.month }}</h2>
    <p>Total Income: Rp {{ report.income }}</p>
    <p>Total Expense: Rp {{ report.expense }}</p>
    <p>Saldo: Rp {{ report.balance }}</p>
  </div>

  <router-link to="/home">
    <button
      class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mt-4"
    >
      ← Kembali ke Home
    </button>
  </router-link>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const report = ref({});

onMounted(async () => {
  const res = await axios.get("http://localhost:8000/api/report/monthly", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  report.value = res.data;
});
</script>
