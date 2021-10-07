import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
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
    cachedAccount: (state) => state.cachedAccount
  },
  actions: {},
  modules: {},
});
