import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/pages/SignUp.vue";
import LogIn from "@/pages/LogIn.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/signup" },
    { name: "signup", path: "/signup", components: { authn: SignUp } },
    { name: "login", path: "/login", components: { authn: LogIn } },
  ],
});