import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/pages/SignUp.vue";
import LogIn from "@/pages/LogIn.vue";
import TheTodos from "@/pages/TheTodos.vue";
import TheNotes from "@/pages/TheNotes.vue";
import TheSettings from "@/pages/TheSettings.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/signup" },
    { name: "signup", path: "/signup", components: { authn: SignUp } },
    { name: "login", path: "/login", components: { authn: LogIn } },
    { name: "todos", path: "/todos", component: TheTodos },
    { name: "notes", path: "/notes", component: TheNotes },
    { name: "settings", path: "/settings", component: TheSettings },
  ],
});
