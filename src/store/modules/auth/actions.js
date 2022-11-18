import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { throwException } from "@/store/index.js";

export default {
  async createAccount(_, payload) {
    try {
      await createUserWithEmailAndPassword(
        getAuth(),
        payload.email,
        payload.password
      );

      // TODO: redirect the user to the todo page
      // TODO: show loading spinner
    } catch (error) {
      throwException(error, "createUserWithEmailAndPassword( ) fn");
    }
  },
  async createAccountWithGoogle() {
    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(getAuth(), provider);

      // TODO: redirect the user to the todo page
      // TODO: show loading spinner
    } catch (error) {
      // alert("Oops! Problem signing in with Google. Refresh the page and try again.");
      throwException(error, "createAccountWithGoogle( ) fn");
    }
  },
  async signIn(context, payload) {
    try {
      await signInWithEmailAndPassword(
        getAuth(),
        payload.email,
        payload.password
      );

      // TODO: store user data locally as shown in with Google
      // TODO: what if multiple user's sign in on the same computer,
      // will one user's sign in overwite another user's preferences?
      // TODO: redirect the user to the todo page
      // TODO: show loading spinner
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

      let storedData = JSON.parse(localStorage.getItem("yourNotesPreferences"));

      // dispatch an action to update the user data stored locally
      context.dispatch(
        "updateLocalStorageData",
        {
          isLoggedIn: true,
          theme: storedData.theme || null,
          fontSize: storedData.fontSize || 14,
        },
        { root: true }
      );
    } catch (error) {
      throwException(error, "signInWithGoogle( ) fn");
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
};
