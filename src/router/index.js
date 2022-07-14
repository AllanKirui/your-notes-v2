import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/components/authn/SignUp.vue";
import LogIn from "@/components/authn/LogIn.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/signup" },
    { name: "signup", path: "/signup", components: { authn: SignUp } },
    { name: "login", path: "/login", components: { authn: LogIn } },
  ],
});
