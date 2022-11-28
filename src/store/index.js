import { createStore } from "vuex";

import authModule from "@/store/modules/auth/index";
import todoModule from "@/store/modules/todos/index";
import notesModule from "@/store/modules/notes/index";

import { db, _doc, _setDoc } from "@/main.js";

// get user data stored locally
let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

export default createStore({
  modules: {
    auth: authModule,
    todos: todoModule,
    notes: notesModule,
  },
  state() {
    return {
      greeting: "",
      theme: storedData ? storedData.theme : null,
      globalFontSize: storedData ? storedData.fontSize : 14,
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
    updateDefaultNoteStatus(state, payload) {
      state.hasDeletedDefaultNote = payload;
    },
    async updateUserPreferences(_, payload) {
      // update the 'preferences' collection in firestore
      try {
        // add a new collection to Firestore called 'preferences', overwrite existing ones
        await _setDoc(
          _doc(db, "preferences", payload.firestoreDocId),
          payload.newPreferences
        );
      } catch (error) {
        throwException(error, "updateUserPreferences( ) fn");
      }
    },
    async updateUsernameCollection(_, payload) {
      try {
        await _setDoc(
          _doc(db, "usernames", payload.firestoreDocId),
          payload.username
        );
      } catch (error) {
        throwException(error, "updateUsernameCollection( ) fn");
      }
    },
    updateStateData(state) {
      state.theme = null;
      state.globalFontSize = 14;
    },
  },
  actions: {
    updateStateData(context) {
      // set the theme and fontsize for new users to the defaults
      context.commit("updateStateData");
    },
    updateLocalStorageData(context, payload) {
      // create a local storage object for a first time user
      if (payload.isNewAccount) {
        let firstTimeUserProps = {
          isLoggedIn: true,
          numOfTodos: 1,
          numOfNotes: 1,
          theme: null,
          fontSize: 14,
        };

        // store the new user's UID and user props
        localStorage.setItem(
          "yourNotesPreferences",
          JSON.stringify(firstTimeUserProps)
        );
        localStorage.setItem("yourNotesUID", JSON.stringify(payload.uid));

        return;
      }

      // otherwise, update the user props for the existing user
      let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

      let userProps = {
        isLoggedIn: true,
        numOfTodos: storedData
          ? storedData.numOfTodos
          : context.rootState.todos.todos.length,
        numOfNotes: storedData
          ? storedData.numOfNotes
          : context.rootState.notes.notes.length,
        theme: storedData ? storedData.theme : null,
        fontSize: storedData ? storedData.fontSize : 14,
      };

      let payloadKeys = Object.keys(payload);

      payloadKeys.forEach((key) => {
        if (key === "isLoggedIn") {
          userProps.isLoggedIn = payload.isLoggedIn;
        } else if (key === "numOfTodos") {
          userProps.numOfTodos = payload.numOfTodos;
        } else if (key === "numOfNotes") {
          userProps.numOfNotes = payload.numOfNotes;
        } else if (key === "theme") {
          userProps.theme = payload.theme;
        } else if (key === "fontSize") {
          userProps.fontSize = payload.fontSize;
        }
      });

      localStorage.setItem("yourNotesPreferences", JSON.stringify(userProps));
      if (payload.uid)
        localStorage.setItem("yourNotesUID", JSON.stringify(payload.uid));
    },
    setGreeting(context) {
      let today = new Date();
      let hour = today.getHours();
      let greeting = "";
      let trimmedName = "";

      // if name is multi-worded, use the first word of the name
      let wordsInName = context.state.auth.user.displayName
        ? context.state.auth.user.displayName.split(" ")
        : "You".split();

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
    updateDefaultNoteStatus(context, payload) {
      context.commit("updateDefaultNoteStatus", payload);
    },
    setUserPreferences(context, payload) {
      context.dispatch("setTheme", payload.theme);
      context.dispatch("setFontSize", payload.fontSize);
      context.dispatch(
        "updateDefaultTodoStatus",
        payload.hasDeletedDefaultTodo
      );
      context.dispatch(
        "updateDefaultNoteStatus",
        payload.hasDeletedDefaultNote
      );

      // dispatch an action to update the user data stored locally
      context.dispatch("updateLocalStorageData", {
        theme: payload.theme,
        fontSize: payload.fontSize,
      });
    },
    updateUserPreferences(context, payload) {
      let newPreferences = {
        theme: context.rootState.theme,
        fontSize: context.rootState.globalFontSize,
        hasDeletedDefaultTodo: context.rootState.hasDeletedDefaultTodo,
        hasDeletedDefaultNote: context.rootState.hasDeletedDefaultNote,
      };

      // get a list of keys in the payload object
      let payloadKeys = Object.keys(payload);

      // check if the list of keys has the following keys
      if (payloadKeys.includes("theme")) {
        newPreferences.theme = payload.theme;
        // dispatch an action to update the user data stored locally
        context.dispatch(
          "updateLocalStorageData",
          { theme: payload.theme },
          { root: true }
        );
      } else if (payloadKeys.includes("fontSize")) {
        newPreferences.fontSize = payload.fontSize;
        // dispatch an action to update the user data stored locally
        context.dispatch(
          "updateLocalStorageData",
          { fontSize: payload.fontSize },
          { root: true }
        );
      } else if (payloadKeys.includes("hasDeletedDefaultTodo")) {
        newPreferences.hasDeletedDefaultTodo = payload.hasDeletedDefaultTodo;
      } else if (payloadKeys.includes("hasDeletedDefaultNote")) {
        newPreferences.hasDeletedDefaultNote = payload.hasDeletedDefaultNote;
      }

      context.commit("updateUserPreferences", {
        firestoreDocId: payload.firestoreDocId,
        newPreferences: newPreferences,
      });
    },
    updateUsernameCollection(context, payload) {
      let username = { username: payload.username };

      // commit a mutation to store username in a Firestore collection
      context.commit("updateUsernameCollection", {
        username: username,
        firestoreDocId: payload.firestoreDocId,
      });
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

// a function that handles firebase errors
export const throwException = (error, location) => {
  let message = "";

  if (error.code && error.message) {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\nError Code: ${error.code}\n\nReasons: ${error.message}`;
  } else {
    message = `Oops! It appears you've discovered an Epic Bug ◔ ⌣ ◔\n\nLocation: ${location}\n\n${error}"`;
  }
  alert(message);
};
