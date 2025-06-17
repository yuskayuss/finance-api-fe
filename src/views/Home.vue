<template>
  <div class="header">
    <h2>🏠 Dashboard</h2>
    <button @click="logout" class="logout-button">Logout</button>
  </div>

  <div class="menu">
    <button @click="router.push('/transactions')">📄 Daftar Transaksi</button>
    <button @click="router.push('/calculator')">
      🧮 Kalkulator Pembiayaan
    </button>
    <button @click="router.push('/report')">📊 Lihat Laporan</button>
    <button @click="router.push('/calculator/mobil')">
      🚗 Simulasi Kredit Mobil
    </button>
    <button @click="router.push('/credit/flat')">Credit flat</button>
  </div>

  <router-view />
</template>

<script setup>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const logout = async () => {
  const result = await Swal.fire({
    title: "Yakin mau logout?",
    text: "Kamu akan keluar dari aplikasi",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, logout",
    cancelButtonText: "Batal",
  });
  if (result.isConfirmed) {
    localStorage.removeItem("token");
    router.push("/");
    Swal.fire("Logout", "Kamu berhasil logout", "success");
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #eef;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.logout-button {
  background-color: crimson;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: darkred;
}

.menu {
  margin: 2rem;
  display: flex;
  gap: 1rem;
}

.menu button {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

.menu button:hover {
  background-color: #eef;
}
</style>
