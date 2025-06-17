<template>
  <div class="loan-calculator">
    <h2>Kalkulator Pembiayaan</h2>

    <form @submit.prevent="calculate">
      <div>
        <label>Jumlah Pembiayaan (Rp):</label>
        <!-- <input type="number" v-model.number="amount" required /> -->
        <input
          type="text"
          :value="formatCurrency(amount)"
          @input="handleAmountInput"
          required
        />
      </div>

      <div>
        <label>Pendapatan Bulanan (Rp):</label>
        <!-- <input type="number" v-model.number="income" required /> -->
        <input
          type="text"
          :value="formatCurrency(income)"
          @input="handleIncomeInput"
          required
        />
      </div>

      <div>
        <label>Tenor (bulan):</label>
        <!-- <input type="number" v-model.number="months" required /> -->
        <input
          type="text"
          :value="formatCurrency(months)"
          @input="handleMonthsInput"
          required
        />
      </div>

      <button type="submit">Hitung</button>
    </form>

    <div v-if="result > 0" class="result">
      <p>Cicilan per bulan: Rp{{ result.toLocaleString() }}</p>
      <p>Total pembayaran: Rp{{ (result * months).toLocaleString() }}</p>
      <p>
        Status: <strong>{{ status }}</strong>
      </p>
    </div>
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
import { ref } from "vue";

const income = ref(0);
const amount = ref(0);
const months = ref(0);

const result = ref(0);
const total = ref(0);
const status = ref("");

// const income = 5000000; // asumsi penghasilan tetap

const formatCurrency = (value) => {
  if (!value) return "";
  return new Intl.NumberFormat("id-ID").format(value);
};

const handleAmountInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  amount.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(amount.value);
};

const handleIncomeInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  income.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(income.value);
};

const handleMonthsInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  months.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(months.value);
};

const calculate = () => {
  const bunga = 0.05 / 12;
  const cicilan =
    (amount.value * bunga) / (1 - Math.pow(1 + bunga, -months.value));

  result.value = Math.round(cicilan);
  total.value = Math.round(cicilan * months.value);

  const batasMaksimal = income.value * 0.4;

  status.value = cicilan > batasMaksimal ? "Tidak Layak" : "Layak";
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};
</script>

<style scoped>
.loan-calculator {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.loan-calculator input {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
}
.loan-calculator button {
  width: 100%;
  padding: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
}
.result {
  margin-top: 20px;
  background: #f0f9ff;
  padding: 10px;
  border-radius: 5px;
}
</style>
