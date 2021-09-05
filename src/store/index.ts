import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const { stringify, parse } = JSON;

export default new Vuex.Store({
  state: {
    runtimeError: null,
  },
  mutations: {
    setRuntimeError: (state, error) => {
      state.runtimeError = error;
    },
    freeRuntimeError: (state) => {
      state.runtimeError = null;
    },
  },
  actions: {},
  modules: {},
});
