export default {
  namespaced: true,
  state() {
    return {
      isOnline: true,
    };
  },
  mutations: {
    updateOnlineStatus(state, payload) {
      state.isOnline = payload;
    },
  },
  actions: {
    setOfflineMode(context, payload) {
      context.commit("updateOnlineStatus", false);

      // pushState takes in 3 arguments; data, message, target path
      if (history.pushState)
        history.pushState(null, "Connection Error", payload);
    },
  },
  getters: {
    isOnline(state) {
      return state.isOnline;
    },
  },
};
