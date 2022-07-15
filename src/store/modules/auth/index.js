import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      user: {
        displayName: null,
        email: null,
        photoURL: null,
        uid: null,
      },
      errorMessage: "",
    };
  },
  actions,
  mutations,
  getters,
};
