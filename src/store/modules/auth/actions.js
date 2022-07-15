import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
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
  createAccountWithGoogle(context) {
    // create a provider when the sign in button is clicked
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) => {
        // TODO: redirect the user to the todo page
        // TODO: show loading spinner

        // sets the current user to the active account
        const user = {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
        };
        console.log("Google user:", user);
        // TODO: commit a mutation to update the user state obj
        context.commit("setUser", user);
      })
      .catch((error) => {
        alert("Oops! Problem signing in with Google. Try again.");
        console.log(error);
      });
  },
};
