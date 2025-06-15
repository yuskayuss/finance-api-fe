<template>
  <form @submit.prevent="login">
    <div>
      <label>Email</label>
      <input v-model="email" type="email" required />
    </div>

    <div>
      <label>Password</label>
      <input v-model="password" type="password" required />
    </div>

    <button type="submit">Login</button>

    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
    const res = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);
    router.push("/transactions"); // ✅ redirect ke halaman transaksi
  } catch (err) {
    error.value =
      "Login gagal: " + (err.response?.data?.message || err.message);
  }
};
</script>
