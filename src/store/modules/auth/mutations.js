export default {
  setError(state, payload) {
    state.errorMessage = payload.message;
  },
  setUser(state, payload) {
    state.user.email = payload.email;
    state.user.displayName = payload.displayName;
    state.user.photoURL = payload.photoURL;
    state.user.uid = payload.uid;
  },
};
