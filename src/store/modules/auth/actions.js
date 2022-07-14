import {
  getAuth,
  createUserWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithPopup,
} from "firebase/auth";

export default {
  createAccount(_, payload) {
    createUserWithEmailAndPassword(getAuth(), payload.email, payload.password)
      .then((data) => {
        console.log(data);
        alert("Successfully registered");
        console.log(getAuth().currentUser);
        // redirect users that complete registration to the feed page
        // this.$router.push("/feed");
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  },
};
