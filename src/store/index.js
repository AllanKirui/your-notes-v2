import { createStore } from "vuex";

import authModule from "@/store/modules/auth/index";
import todoModule from "@/store/modules/todos/index";

export default createStore({
  modules: {
    auth: authModule,
    todos: todoModule,
  },
  state() {},
  mutations: {},
  actions: {},
  getters: {},
});
