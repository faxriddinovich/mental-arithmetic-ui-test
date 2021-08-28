import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    runtimeError: null,
    test: "test"
  },
  mutations: {
setRuntimeError: (state, error) => {
      state.runtimeError = error
    },
freeRuntimeError: (state) => {
      state.runtimeError = null;
    }
  },
  actions: {},
  modules: {},
});
