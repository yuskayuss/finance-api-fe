<template>
  <div>
    <h2>➕ Tambah Transaksi</h2>
    <form @submit.prevent="submitTransaction">
      <input
        v-model="type"
        type="text"
        placeholder="income / expense"
        required
      />
      <input
        v-model="description"
        type="text"
        placeholder="Deskripsi"
        required
      />
      <input
        v-model.number="amount"
        type="number"
        placeholder="Jumlah"
        required
      />
      <input v-model="date" type="date" required />
      <button type="submit">Simpan</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const type = ref("");
const description = ref("");
const amount = ref(0);
const date = ref("");

const submitTransaction = async () => {
  try {
    await axios.post(
      "http://localhost:8000/api/transactions",
      {
        type: type.value,
        description: description.value,
        amount: amount.value,
        date: date.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Transaksi berhasil ditambahkan!");
    // Reset form
    type.value = "";
    description.value = "";
    amount.value = 0;
    date.value = "";
  } catch (error) {
    console.error("Gagal tambah transaksi:", error);
  }
};
</script>
