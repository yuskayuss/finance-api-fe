<template>
  <form @submit.prevent="submitTransaction">
    <div>
      <label>Type</label>
      <select v-model="form.type" required>
        <option disabled value="">Pilih Jenis</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
    </div>

    <div>
      <label>Description</label>
      <input v-model="form.description" type="text" required />
    </div>

    <div>
      <label>Amount</label>
      <input v-model.number="form.amount" type="number" required />
    </div>

    <div>
      <label>Date</label>
      <input v-model="form.date" type="date" required />
    </div>

    <button type="submit">Simpan Transaksi</button>

    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const form = ref({
  type: "",
  description: "",
  amount: null,
  date: "",
});

const message = ref("");

const submitTransaction = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:8000/api/transactions",
      form.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.value = "Transaksi berhasil disimpan!";
    form.value = { type: "", description: "", amount: null, date: "" };
  } catch (err) {
    message.value = "Gagal menyimpan transaksi.";
    console.error(err.response?.data || err.message);
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 10px;
}
</style>
