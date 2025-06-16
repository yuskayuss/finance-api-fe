import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import TransactionList from "../components/TransactionList.vue";
import Report from "../views/Report.vue";
import LoanCalculator from "../components/LoanCalculator.vue";

const routes = [
  { path: "/", component: LoginForm },
  { path: "/transactions", component: TransactionList },
  {
    path: "/report",
    name: "Report",
    component: Report,
  },
  {
    path: "/calculator",
    name: "LoanCalculator",
    component: LoanCalculator,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
