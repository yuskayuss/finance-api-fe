<!-- CalculatorForm.vue -->
<template>
  <div>
    <h2>Kalkulator Pembiayaan</h2>
    <form @submit.prevent="hitungCicilan">
      <label>Jumlah Pembiayaan</label>
      <input v-model.number="jumlah" type="number" required />

      <label>Tenor (bulan)</label>
      <select v-model.number="tenor">
        <option v-for="n in [6, 12, 18, 24]" :key="n" :value="n">
          {{ n }} bulan
        </option>
      </select>

      <button type="submit">Hitung</button>
    </form>

    <div v-if="hasil">
      <h3>Hasil Perhitungan:</h3>
      <p>
        Cicilan per bulan: <b>Rp{{ hasil.cicilanBulanan }}</b>
      </p>
      <p>Total pembayaran: Rp{{ hasil.totalPembayaran }}</p>
      <p>
        Status:
        <b :style="{ color: hasil.layak ? 'green' : 'red' }">
          {{ hasil.layak ? "Layak" : "Tidak Layak" }}
        </b>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const jumlah = ref(0);
const tenor = ref(12);
const hasil = ref(null);

const hitungCicilan = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/calculate",
      {
        jumlah: jumlah.value,
        tenor: tenor.value,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    hasil.value = res.data;
  } catch (err) {
    alert("Gagal hitung: " + err.response?.data?.message || err.message);
  }
};
</script>
