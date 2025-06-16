<template>
  <div id="app">
    <router-view />
    <!-- <div>
      <button @click="showForm = !showForm">
        {{ showForm ? "Tutup Kalkulator" : "Buka Kalkulator Pembiayaan" }}
      </button>

      <LoanCalculator v-if="showForm" />
    </div> -->

    <!-- ✅ Di sinilah komponen berdasarkan route muncul -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoanCalculator from "./components/LoanCalculator.vue";

const toggleCalculator = () => {
  if (route.path === "/calculator") {
    router.push("/transactions"); // balik ke transaksi
  } else {
    router.push("/calculator"); // buka kalkulator
  }
};
const showForm = ref(false);
// tidak perlu apa-apa di sini jika hanya routing
</script>
