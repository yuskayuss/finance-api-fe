<template>
  <div>
    <h2>📄 Daftar Transaksi</h2>

    <!-- ✅ Form Tambah/Edit Transaksi -->

    <form
      @submit.prevent="isEditing ? updateTransaction() : submitTransaction()"
    >
      <div>
        <label>Type</label>
        <select v-model="form.type" required>
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

      <button type="submit">
        {{ isEditing ? "Update" : "Simpan Transaksi" }}
      </button>
    </form>

    <!-- ✅ Daftar Transaksi -->
    <ul>
      <li v-for="tx in transactions" :key="tx.id">
        {{ tx.date }} | {{ tx.type.toUpperCase() }} | {{ tx.description }} -
        Rp{{ tx.amount }}
        <button @click="editTransaction(tx)">✏️ Edit</button>
        <button @click="deleteTransaction(tx.id)">🗑️ Hapus</button>
      </li>
    </ul>

    <router-link to="/home">
      <button
        class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mt-4"
      >
        ← Kembali ke Home
      </button>
    </router-link>

    <!-- ✅ Tombol Logout -->
    <!-- <button @click="logout">🔓 Logout</button>

    <button @click="router.push('/report')">📊 Lihat Laporan</button>
    <button @click="router.push('/calculator')">Kalkulator Pembiayaan</button> -->

    <!-- <button @click="openCalculator">Buka Kalkulator</button> -->
  </div>
</template>

<script setup>
// import CalculatorForm from "@/components/CalculatorForm.vue"; // pastikan path sesuai
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const showCalculator = ref(false);
const router = useRouter();
const transactions = ref([]);
const form = ref({
  id: null,
  type: "",
  description: "",
  amount: null,
  date: "",
});
const toggleCalculator = () => {
  if (route.path === "/calculator") {
    router.push("/transactions"); // balik ke transaksi
  } else {
    router.push("/calculator"); // buka kalkulator
  }
};

const isEditing = ref(false);

const openCalculator = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Kalkulator Pembiayaan",
    html:
      `<input id="amount" class="swal2-input" placeholder="Jumlah Pembiayaan">` +
      `<input id="months" class="swal2-input" placeholder="Tenor Bulan">`,
    focusConfirm: false,
    preConfirm: () => {
      return [
        parseInt(document.getElementById("amount").value),
        parseInt(document.getElementById("months").value),
      ];
    },
  });

  if (formValues) {
    const [amount, months] = formValues;
    const interest = 0.05 / 12;
    const result = (amount * interest) / (1 - Math.pow(1 + interest, -months));
    const income = 5000000;
    const status = result > income * 0.4 ? "Tidak Layak" : "Layak";

    Swal.fire(`Cicilan: Rp${result.toFixed(0)}\nStatus: ${status}`);
  }
};

//Saat klik edit
const editTransaction = (tx) => {
  form.value = { ...tx }; //salin data ke form
  isEditing.value = true;
};

//Simpan perubahan
const updateTransaction = async () => {
  try {
    const res = await axios.put(
      `http://localhost:8000/api/transactions/${form.value.id}`,
      form.value,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // perbarui transaksi di list
    const index = transactions.value.findIndex((t) => t.id === form.value.id);
    if (index !== -1) transactions.value[index] = res.data;

    form.value = {
      id: null,
      type: "",
      description: "",
      amount: null,
      date: "",
    };
    isEditing.value = false;
  } catch (error) {
    console.error("Gagal update:", error);
  }
};

const submitTransaction = async () => {
  try {
    await axios.post("http://localhost:8000/api/transactions", form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data telah tersimpan.",
    });
    await fetchTransactions();
    resetForm();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Gagal menyimpan!",
      text: err.response?.data?.message || "Terjadi kesalahan",
    });
  }
};

const fetchTransactions = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/transactions", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    transactions.value = res.data;
  } catch (error) {
    Swal.fire("Error", "Gagal fetch transaksi:", error);
  }
};

const deleteTransaction = async (id) => {
  const confirm = await Swal.fire({
    title: "Yakin",
    text: "Transaksi ini akan dihapus",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });
  if (confirm.isConfirmed) {
    try {
      await axios.delete(`http://localhost:8000/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      transactions.value = transactions.value.filter((tx) => tx.id !== id);
      Swal.fire("Berhasil", "Transaksi dihapus", "success");
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", error);
    }
  }
};

// ✅ Fungsi logout
const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
  Swal.fire("Logout", "Berhasil logout", "info");
};

onMounted(fetchTransactions);
</script>
