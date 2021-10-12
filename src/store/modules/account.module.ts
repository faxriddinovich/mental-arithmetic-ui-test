export default {
  state: {
    cachedAccount: null,
  },
  mutations: {
    setCachedAccount: (state, account) => {
      state.cachedAccount = account;
    },
    releaseCachedAccount: (state) => {
      state.cachedAccount = null;
    },
  },
  getters: {
    cachedAccount: (state) => state.cachedAccount,
  },
};
