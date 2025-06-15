<template>
  <div>
    <h2>📄 Daftar Transaksi</h2>

    <!-- Tombol Logout -->
    <button @click="logout">🔓 Logout</button>

    <ul>
      <li v-for="tx in transactions" :key="tx.id">
        {{ tx.date }} | {{ tx.type.toUpperCase() }} | {{ tx.description }} -
        Rp{{ tx.amount }}
        <button @click="deleteTransaction(tx.id)">🗑️ Hapus</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const transactions = ref([]);

const fetchTransactions = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/transactions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    transactions.value = res.data;
  } catch (error) {
    console.error("Gagal fetch transaksi:", error);
  }
};

const deleteTransaction = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/api/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    transactions.value = transactions.value.filter((tx) => tx.id !== id);
  } catch (error) {
    console.error("Gagal hapus transaksi:", error);
  }
};

// ✅ Fungsi logout
const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

onMounted(fetchTransactions);
</script>
