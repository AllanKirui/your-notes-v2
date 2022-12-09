import { createRouter, createWebHistory } from "vue-router";

import SignUp from "@/pages/SignUp.vue";
import LogIn from "@/pages/LogIn.vue";
import TheTodos from "@/pages/TheTodos.vue";
import TheNotes from "@/pages/TheNotes.vue";
import TheSettings from "@/pages/TheSettings.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/your-notes-v2/signup" },
    { path: "/your-notes-v2", redirect: "/your-notes-v2/signup" },
    {
      name: "signup",
      path: "/your-notes-v2/signup",
      components: { authn: SignUp },
    },
    {
      name: "login",
      path: "/your-notes-v2/login",
      components: { authn: LogIn },
    },
    { name: "todos", path: "/your-notes-v2/todos", component: TheTodos },
    { name: "notes", path: "/your-notes-v2/notes", component: TheNotes },
    {
      name: "settings",
      path: "/your-notes-v2/settings",
      component: TheSettings,
    },
    { path: "/:notFound(.*)", redirect: "/your-notes-v2/signup" },
    { path: "/your-notes-v2/:notFound(.*)", redirect: "/your-notes-v2/signup" },
  ],
});
