import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import Home from "../views/Home.vue";
import TransactionList from "../components/TransactionList.vue";
import Report from "../views/Report.vue";
import LoanCalculator from "../components/LoanCalculator.vue";
import LoanCalculatorMobil from "../components/LoanCalculatorMobil.vue";

const routes = [
  { path: "/", component: LoginForm },
  {
    path: "/home",
    component: Home,
  },
  { path: "/transactions", component: TransactionList },
  { path: "/calculator", component: LoanCalculator },

  {
    path: "/report",
    name: "Report",
    component: Report,
  },
  {
    path: "/calculator/mobil",
    component: LoanCalculatorMobil,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
