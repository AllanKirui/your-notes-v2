import { createStore } from "vuex";

import authModule from "@/store/modules/auth/index";

export default createStore({
  modules: {
    auth: authModule,
  },
  state() {},
  mutations: {},
  actions: {},
  getters: {},
});
