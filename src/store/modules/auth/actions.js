import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { throwException } from "@/store/index.js";

export default {
  async createAccount(context, payload) {
    // clear any existing local storage Objects
    localStorage.removeItem("yourNotesPreferences");

    try {
      await createUserWithEmailAndPassword(
        getAuth(),
        payload.email,
        payload.password
      );

      let uid = getAuth().currentUser.uid;
      let storedUID = JSON.parse(localStorage.getItem("yourNotesUID"));

      // check if there is a stored UID and whether it matches the current user's ID
      if (storedUID) {
        if (storedUID !== uid) {
          // dispatch an action to clear any existing todos from the list of todos
          context.dispatch("todos/clearTodosList", {}, { root: true });

          // dispatch an action to clear any existing notes from the list of notes
          context.dispatch("notes/clearNotesList", {}, { root: true });

          // clear the local storage object holding the UID
          localStorage.removeItem("yourNotesUID");
        }
      }

      // dispatch an action to update the state data
      context.dispatch("updateStateData", {}, { root: true });

      // dispatch an action to store the new user's data locally
      context.dispatch(
        "updateLocalStorageData",
        {
          uid: uid,
          isNewAccount: true,
        },
        { root: true }
      );

      // dispatch an action to store username in a Firestore collection
      context.dispatch(
        "updateUsernameCollection",
        {
          username: payload.username,
          firestoreDocId: getAuth().currentUser.uid,
        },
        { root: true }
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        context.commit("setError", {
          message: "This email is already in use!",
          field: "email",
        });
        return;
      }

      throwException(
        error,
        "createUserWithEmailAndPassword( ) fn in store/modules/auth/actions"
      );
    }
  },
  async createAccountWithGoogle(context) {
    // clear any existing local storage Objects
    localStorage.removeItem("yourNotesPreferences");

    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(getAuth(), provider);

      let uid = getAuth().currentUser.uid;
      let storedUID = JSON.parse(localStorage.getItem("yourNotesUID"));

      // check if there is a stored UID and whether it matches the current user's ID
      if (storedUID) {
        if (storedUID !== uid) {
          // dispatch an action to clear any existing todos from the list of todos
          context.dispatch("todos/clearTodosList", {}, { root: true });

          // dispatch an action to clear any existing notes from the list of notes
          context.dispatch("notes/clearNotesList", {}, { root: true });

          // clear the local storage object holding the UID
          localStorage.removeItem("yourNotesUID");
        }
      }

      // dispatch an action to update the state data
      context.dispatch("updateStateData", {}, { root: true });

      // dispatch an action to store the new user's data locally
      context.dispatch(
        "updateLocalStorageData",
        {
          uid: uid,
          isNewAccount: true,
        },
        { root: true }
      );
    } catch (error) {
      throwException(
        error,
        "createAccountWithGoogle( ) fn in store/modules/auth/actions"
      );
    }
  },
  async signIn(context, payload) {
    try {
      await signInWithEmailAndPassword(
        getAuth(),
        payload.email,
        payload.password
      );

      let uid = getAuth().currentUser.uid;
      let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));
      let storedUID = JSON.parse(localStorage.getItem("yourNotesUID"));

      // check if there is a stored UID and whether it matches the current user's ID
      if (storedUID) {
        if (storedUID !== uid) {
          // dispatch an action to clear any existing todos from the list of todos
          context.dispatch("todos/clearTodosList", {}, { root: true });

          // dispatch an action to clear any existing notes from the list of notes
          context.dispatch("notes/clearNotesList", {}, { root: true });

          // dispatch an action to update the state data
          context.dispatch("updateStateData", {}, { root: true });

          // clear any existing local storage Objects
          localStorage.removeItem("yourNotesPreferences");
          localStorage.removeItem("yourNotesUID");
        } else {
          // dispatch an action to update the user data stored locally
          context.dispatch(
            "updateLocalStorageData",
            {
              isLoggedIn: true,
              theme: storedData ? storedData.theme : null,
              fontSize: storedData ? storedData.fontSize : 14,
              uid: uid,
            },
            { root: true }
          );

          // store the logged in user's UID locally
          localStorage.setItem("yourNotesUID", JSON.stringify(uid));
        }

        return;
      }

      // dispatch an action to update the user data stored locally
      context.dispatch(
        "updateLocalStorageData",
        {
          isLoggedIn: true,
          theme: null,
          fontSize: 14,
          uid: uid,
        },
        { root: true }
      );

      // store the logged in user's UID locally
      localStorage.setItem("yourNotesUID", JSON.stringify(uid));
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          context.commit("setError", {
            message: "Email is not properly formatted",
            field: "email",
          });
          break;
        case "auth/user-not-found":
          context.commit("setError", {
            message: "No account with that email was found",
            field: "email",
          });
          break;
        case "auth/wrong-password":
          // TODO: Show 'forgot password' link
          context.commit("setError", {
            message: "Incorrect password",
            field: "password",
          });
          break;
        default:
          // set the error on both fields
          context.commit("setError", {
            message: error.code,
            field: "email",
          });
          context.commit("setError", {
            message: error.code,
            field: "password",
          });
          break;
      }
    }
  },
  async signInWithGoogle(context) {
    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(getAuth(), provider);

      let uid = getAuth().currentUser.uid;
      let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));
      let storedUID = JSON.parse(localStorage.getItem("yourNotesUID"));

      // check if there is a stored UID and whether it matches the current user's ID
      if (storedUID) {
        if (storedUID !== uid) {
          // dispatch an action to clear any existing todos from the list of todos
          context.dispatch("todos/clearTodosList", {}, { root: true });

          // dispatch an action to clear any existing notes from the list of notes
          context.dispatch("notes/clearNotesList", {}, { root: true });

          // dispatch an action to update the state data
          context.dispatch("updateStateData", {}, { root: true });

          // dispatch an action to update the display name
          context.dispatch("updateUserProfile", { username: null });

          // clear any existing local storage Objects
          localStorage.removeItem("yourNotesPreferences");
          localStorage.removeItem("yourNotesUID");
        } else {
          // dispatch an action to update the user data stored locally
          context.dispatch(
            "updateLocalStorageData",
            {
              isLoggedIn: true,
              theme: storedData ? storedData.theme : null,
              fontSize: storedData ? storedData.fontSize : 14,
              uid: uid,
            },
            { root: true }
          );

          // store the logged in user's UID locally
          localStorage.setItem("yourNotesUID", JSON.stringify(uid));
        }

        return;
      }

      // dispatch an action to update the user data stored locally
      context.dispatch(
        "updateLocalStorageData",
        {
          isLoggedIn: true,
          theme: null,
          fontSize: 14,
          uid: uid,
        },
        { root: true }
      );

      // store the logged in user's UID locally
      localStorage.setItem("yourNotesUID", JSON.stringify(uid));
    } catch (error) {
      throwException(
        error,
        "signInWithGoogle( ) fn in store/modules/auth/actions"
      );
    }
  },
  createUserProfile(context, payload) {
    // sets the current user to the active account
    const user = {
      displayName: payload.displayName,
      email: payload.email,
      photoURL: payload.photoURL,
      uid: payload.uid,
    };

    // commit a mutation to update the 'user' state obj
    context.commit("setUser", user);
  },
  updateUserProfile(context, payload) {
    // commit a mutation to update the 'user' state obj
    context.commit("updateUserProfile", payload);
  },
};
