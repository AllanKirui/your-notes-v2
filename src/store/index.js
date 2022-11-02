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
      hasDeletedDefaultTodo: false,
      hasDeletedDefaultNote: false,
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
    updateDefaultTodoStatus(state, payload) {
      state.hasDeletedDefaultTodo = payload;
    },
    async updateUserPreferences(state, payload) {
      let newPreferences = {
        theme: state.theme,
        fontSize: state.globalFontSize,
        hasDeletedDefaultTodo: state.hasDeletedDefaultTodo,
      };

      // get a list of keys in the payload object
      let payloadKeys = Object.keys(payload);

      // check if the list of keys has the following keys
      if (payloadKeys.includes("theme")) {
        newPreferences.theme = payload.theme;
      } else if (payloadKeys.includes("fontSize")) {
        newPreferences.fontSize = payload.fontSize;
      } else if (payloadKeys.includes("hasDeletedDefaultTodo")) {
        newPreferences.hasDeletedDefaultTodo = payload.hasDeletedDefaultTodo;
      }

      // update the 'preferences' collection in firestore
      try {
        // add a new collection to Firestore called 'preferences', overwrite existing ones
        await payload.setDoc(
          payload.doc(payload.db, "preferences", payload.firestoreDocId),
          newPreferences
        );
      } catch (error) {
        alert(`Something went wrong!\n${error}`);
      }
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
    updateDefaultTodoStatus(context, payload) {
      context.commit("updateDefaultTodoStatus", payload);
    },
    setUserPreferences(context, payload) {
      context.dispatch("setTheme", payload.theme);
      context.dispatch("setFontSize", payload.fontSize);
      context.dispatch(
        "updateDefaultTodoStatus",
        payload.hasDeletedDefaultTodo
      );
    },
    updateUserPreferences(context, payload) {
      context.commit("updateUserPreferences", payload);
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
    hasDeletedDefaultTodo(state) {
      return state.hasDeletedDefaultTodo;
    },
    hasDeletedDefaultNote(state) {
      return state.hasDeletedDefaultNote;
    },
  },
});
