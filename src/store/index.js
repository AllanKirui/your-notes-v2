import { createStore } from "vuex";

import authModule from "@/store/modules/auth/index";
import todoModule from "@/store/modules/todos/index";
import notesModule from "@/store/modules/notes/index";

export default createStore({
  modules: {
    auth: authModule,
    todos: todoModule,
    notes: notesModule,
  },
  state() {
    return {
      greeting: "",
      theme: null,
      globalFontSize: 14,
    };
  },
  mutations: {
    setGreeting(state, payload) {
      state.greeting = payload;
    },
    setTheme(state, payload) {
      state.theme = payload;
    },
    setFontSize(state, payload) {
      state.globalFontSize = payload;
    },
  },
  actions: {
    setGreeting(context) {
      let today = new Date();
      let hour = today.getHours();
      let greeting = "";
      let trimmedName = "";

      // if name is multi-worded, use the first word of the name
      let wordsInName = context.state.auth.user.displayName.split(" ");
      if (wordsInName.length > 0) {
        trimmedName = wordsInName[0];
      }

      // set an appropriate greeting based on the time
      if (hour >= 16) {
        greeting = `Good evening, ${trimmedName}`;
      } else if (hour >= 12) {
        greeting = `Good afternoon, ${trimmedName}`;
      } else if (hour >= 0) {
        greeting = `Good morning, ${trimmedName}`;
      }

      // commit a mutation to set the greeting
      context.commit("setGreeting", greeting);
    },
    setTheme(context, payload) {
      context.commit("setTheme", payload);
    },
    setFontSize(context, payload) {
      context.commit("setFontSize", payload);
    },
  },
  getters: {
    greeting(state) {
      return state.greeting;
    },
    theme(state) {
      return state.theme;
    },
    globalFontSize(state) {
      return state.globalFontSize;
    },
  },
});
