import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import TransactionList from "../components/TransactionList.vue";

const routes = [
  { path: "/", component: LoginForm },
  { path: "/transactions", component: TransactionList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
