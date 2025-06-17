<template>
  <div class="loan-calculator">
    <h3>Simulasi Kredit Mobil</h3>

    <form @submit.prevent="calculate">
      <div>
        <label>Merk & Tipe Mobil</label>
        <input v-model="car" type="text" required />
      </div>

      <div>
        <label>Harga Mobil (Rp)</label>
        <!-- <input v-model.number="amount" type="number" required /> -->
        <input
          type="text"
          :value="formatCurrency(amount)"
          @input="handleAmountInput"
          required
        />
      </div>

      <div>
        <label>Uang Muka (Dp) (Rp)</label>
        <!-- <input v-model.number="dp" type="number" required /> -->
        <input
          type="text"
          :value="formatCurrency(dp)"
          @input="handleDpInput"
          required
        />
      </div>

      <div>
        <label>Tenor (bulan)</label>
        <!-- <input v-model.number="months" type="number" required /> -->
        <input
          type="text"
          :value="formatCurrency(months)"
          @input="handleMonthsInput"
          required
        />
      </div>

      <div>
        <label>Pendapatan Bulanan (Rp)</label>
        <!-- <input v-model.number="income" type="number" required /> -->
        <input
          type="text"
          :value="formatCurrency(income)"
          @input="handleIncomeInput"
          required
        />
      </div>

      <button type="submit">Hitung</button>
    </form>

    <div v-if="result > 0" class="result" ref="pdfContent">
      <h4>Hasil Perhitungan:</h4>
      <p>Cicilan per bulan: {{ formatCurrency(result) }}</p>
      <p>Total pembayaran: {{ formatCurrency(totalPayment) }}</p>
      <p>
        Status:
        <strong :style="{ color: status === 'layak' ? 'green' : 'red' }">{{
          status
        }}</strong>
      </p>
      <button v-if="result > 0" @click="exportToPDF">Export ke PDF</button>
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
import html2pdf from "html2pdf.js";

const car = ref("");
const amount = ref(0);
const dp = ref(0);
const months = ref(0);
const income = ref(0);

const result = ref(0);
const totalPayment = ref(0);
const status = ref("");
const pdfContent = ref(null);

const exportToPDF = () => {
  const element = pdfContent.value;

  const opt = {
    margin: 0.5,
    filename: "simulasi-pembiayaan.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(opt).save();
};

const calculate = () => {
  const loanAmount = amount.value - dp.value;
  const bunga = 0.06 / 12; // 6 % pertahun
  result.value =
    (loanAmount * bunga) / (1 - Math.pow(1 + bunga, -months.value));
  totalPayment.value = result.value * months.value;
  status.value = result.value > income.value * 0.4 ? "Tidak Layak" : "Layak";
};

const handleAmountInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  amount.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(amount.value);
};

const handleDpInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  dp.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(dp.value);
};

const handleMonthsInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  months.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(months.value);
};

const handleIncomeInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  income.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(income.value);
};

const formatCurrency = (num) => {
  return Number(num).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};
</script>

<style scoped>
.loan-calculator {
  max-width: 400px;
  margin: auto;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 12px;
  background: #f9f9f9;
}
.loan-calculator label {
  display: block;
  margin-top: 10px;
}
.loan-calculator input {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
}
.loan-calculator button {
  margin-top: 12px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
