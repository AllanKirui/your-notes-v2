export default {
  setError(state, payload) {
    state.error = payload;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  updateUserProfile(state, payload) {
    state.user.displayName = payload.username;
  },
};
