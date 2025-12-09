import Vue from "vue";
import Vuex from "vuex";
import Account from "./modules/account.module";
import BigNumbers from "./modules/big-numbers-game.module";
import Abacus from './modules/abacus-game.module';
import TextToSpeech from './modules/text-to-speech.module';
import Settings from './modules/settings.module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    synced: false
  },
  modules: { Account, BigNumbers, Abacus, TextToSpeech, Settings,  },
});
