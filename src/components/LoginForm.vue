<template>
  <div class="login-container">
    <h2>🔐 Login</h2>

    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">Login</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
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
    router.push("/home"); // redirect ke halaman Home dengan tab transaksi, kalkulator, dll
  } catch (err) {
    error.value =
      "Login gagal: " + (err.response?.data?.message || err.message);
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fff;
}

.login-form .form-group {
  margin-bottom: 1rem;
}

.login-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.login-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #aaa;
  border-radius: 6px;
}

button {
  padding: 0.6rem 1rem;
  background-color: royalblue;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: dodgerblue;
}

.error {
  margin-top: 1rem;
  color: red;
}
</style>
