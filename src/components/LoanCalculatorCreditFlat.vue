<template>
  <div class="credit-simulator">
    <h2>Simulasi Kredit</h2>
    <p>Lakukan Simulasi pinjaman anda dengan kalkulator kredit ini</p>

    <form @submit.prevent="calculateInstallment">
      <div>
        <label>Jumlah Pinjaman (Rp):</label>
        <!-- <input type="number" v-model.number="loanAmount" required /> -->
        <input
          type="text"
          :value="formatCurrency(loanAmount)"
          @input="handleLoanAmountInput"
          required
        />
      </div>

      <div>
        <label>Lama Pinjaman (bulan):</label>
        <input type="number" v-model.number="loanDuration" required />
      </div>

      <div>
        <label>Bunga per Tahun (%):</label>
        <input
          type="number"
          v-model.number="interestRate"
          step="0.01"
          required
        />
      </div>

      <div>
        <label>Mulai Meminjam (Bulan dan Tahun):</label>
        <input type="month" v-model="startDate" required />
      </div>
      <button type="submit">Hitung</button>
    </form>
    <div v-if="monthlyInstallment" class="result" ref="pdfContent">
      <h3>Hasil Perhitungan</h3>
      <p><strong>Jumlah Pinjaman:</strong> {{ formatRupiah(loanAmount) }}</p>
      <p>
        <strong>Lama Pinjaman:</strong>{{ loanDuration }} bulan ({{
          (loanDuration / 12).toFixed(2)
        }}
        tahun)
      </p>
      <p>
        <strong>Bunga per Tahun:</strong>{{ interestRate }} % ({{
          monthlyRate.toFixed(2)
        }}
        % / bulan)
      </p>
      <p><strong>Mulai Meminjam:</strong>{{ formattedStarDate }}</p>
      <p><strong>Perhitungan Bunga:</strong>FLAT</p>
      <p>
        <strong>Angsuran Pokok per Bulan:</strong>
        {{ formatRupiah(principalInstallment) }}
      </p>
      <p>
        <strong>Angsuran Bunga per Bulan:</strong
        >{{ formatRupiah(interestInstallment) }}
      </p>
      <p>
        <strong>Total Angsuran per Bulan:</strong>
        {{ formatRupiah(monthlyInstallment) }}
      </p>

      <h4>Tabel Angsuran</h4>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Periode</th>
            <th>Angsuran Bunga</th>
            <th>Angsuran Pokok</th>
            <th>Total Angsuran</th>
            <th>Sisa Pinjaman</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in installmentTable" :key="index">
            <td>{{ item.period }}</td>
            <td>{{ formatRupiah(item.interest) }}</td>
            <td>{{ formatRupiah(item.principal) }}</td>
            <td>{{ formatRupiah(item.total) }}</td>
            <td>{{ formatRupiah(item.remaining) }}</td>
          </tr>
        </tbody>
      </table>
      <button v-if="monthlyInstallment" @click="exportToPDF">
        Export ke PDF
      </button>
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
import { ref, computed } from "vue";
import html2pdf from "html2pdf.js";

// Ref untuk konten PDF
const pdfContent = ref(null);

const loanAmount = ref(1000000);
const loanDuration = ref(24);
const interestRate = ref(8.6);
const startDate = ref("2025-06");

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

const handleLoanAmountInput = (e) => {
  let raw = e.target.value.replace(/[^\d]/g, ""); // hanya angka 0–9

  // Update model
  loanAmount.value = parseInt(raw || "0", 10);

  // Update tampilan input dengan format rupiah
  e.target.value = formatCurrency(loanAmount.value);
};

const monthlyRate = computed(() => interestRate.value / 12 / 100);
const principalInstallment = computed(
  () => loanAmount.value / loanDuration.value
);
const interestInstallment = computed(
  () => loanAmount.value * monthlyRate.value
);
const monthlyInstallment = computed(
  () => principalInstallment.value + interestInstallment.value
);

const formattedStarDate = computed(() => {
  const [year, month] = startDate.value.split("-");
  return new Date(year, month - 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
});

const installmentTable = ref([]);

function calculateInstallment() {
  let remaining = loanAmount.value;
  const table = [];
  const [year, month] = startDate.value.split("-");
  const start = new Date(Number(year), Number(month) - 1);

  for (let i = 0; i < loanDuration.value; i++) {
    const current = new Date(start.getFullYear(), start.getMonth() + i);
    const period = current.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });

    const row = {
      period,
      interest: interestInstallment.value,
      principal: principalInstallment.value,
      total: monthlyInstallment.value,
      remaining: remaining - principalInstallment.value,
    };

    remaining -= principalInstallment.value;
    if (remaining < 0) remaining = 0;

    table.push(row);
  }
  installmentTable.value = table;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(value);
}

const formatCurrency = (num) => {
  return Number(num).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};
</script>

<style scoped>
.credit-simulator {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}
input {
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
}
table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5rem;
  text-align: center;
}
</style>
