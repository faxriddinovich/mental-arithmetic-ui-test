import Vue from "vue";
import Vuex from "vuex";
import AccountModule from "./modules/account.module";
import SessionModule from "./modules/session.module";
import SettingsModule from "./modules/settings.module";
import GameModule from './modules/game.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { SessionModule, SettingsModule, AccountModule, GameModule },
});
