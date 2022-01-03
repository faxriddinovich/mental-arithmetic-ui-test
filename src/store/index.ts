import Vue from "vue";
import Vuex from "vuex";
import Account from "./modules/account.module";
import BigNumbers from "./modules/big-numbers-game.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { Account, BigNumbers },
});
