import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/Pages/SignUp.vue";
import LogIn from "@/Pages/LogIn.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/signup" },
    { name: "signup", path: "/signup", components: { authn: SignUp } },
    { name: "login", path: "/login", components: { authn: LogIn } },
  ],
});
