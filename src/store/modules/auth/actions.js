import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default {
  createAccount(_, payload) {
    createUserWithEmailAndPassword(getAuth(), payload.email, payload.password)
      .then((data) => {
        // TODO: redirect the user to the todo page
        // TODO: show loading spinner

        console.log(data);
        alert("Successfully registered");
        // console.log(getAuth().currentUser);
      })
      .catch((error) => {
        // context.commit("setError", error);
        alert(error.message);
        console.log(error);
      });
  },
  createAccountWithGoogle() {
    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        // TODO: redirect the user to the todo page
        // TODO: show loading spinner
        console.log(result);
      })
      .catch((error) => {
        alert("Oops! Problem signing in with Google. Try again.");
        console.log(error);
      });
  },
  signIn(context, payload) {
    signInWithEmailAndPassword(getAuth(), payload.email, payload.password)
      .then(() => {
        // TODO: redirect the user to the todo page
        // TODO: show loading spinner

        // dispatch an action to store an authenticated user's data
        context.dispatch("createUserProfile", getAuth().currentUser);
      })
      .catch((error) => {
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
      });
  },
  signInWithGoogle(context) {
    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then(() => {
        // dispatch an action to store an authenticated user's data
        context.dispatch("createUserProfile", getAuth().currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
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
