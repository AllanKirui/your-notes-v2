export default {
  setError(state, payload) {
    state.error = payload;
  },
  setUser(state, payload) {
    state.isAuth = true;
    state.user = payload;
  },
};
