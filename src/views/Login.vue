<!-- src/views/Login.vue -->
<template>
  <div class="max-w-md mx-auto mt-20 p-6 border rounded shadow">
    <h2 class="text-xl font-bold mb-4">🔐 Login</h2>

    <form @submit.prevent="login">
      <div class="mb-4">
        <label>Email:</label>
        <input
          v-model="email"
          type="email"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div class="mb-4">
        <label>Password:</label>
        <input
          v-model="password"
          type="password"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div class="text-red-500 mb-2" v-if="error">{{ error }}</div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  try {
    const res = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);
    router.push("/home"); // ⬅️ Redirect ke halaman home
  } catch (err) {
    error.value = err.response?.data?.message || "Login gagal!";
  }
};
</script>
