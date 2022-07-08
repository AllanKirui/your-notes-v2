import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/components/authn/SignUp.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/signup" },
    { name: "signup", path: "/signup", components: { authn: SignUp } },
  ],
});
