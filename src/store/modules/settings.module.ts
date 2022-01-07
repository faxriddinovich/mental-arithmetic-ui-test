import {ActionContext} from 'vuex';
import Vue from 'vue';

export interface Settings {
  showLatestEvent: boolean,
  locale: 'en-US' | 'ru-RU' | 'uz-UZ'
  ttsVoiceIdentity: number | null
}

const defaultSettings: Settings = {
  showLatestEvent: true,
  locale: 'en-US',
  ttsVoiceIdentity: null
}

interface StateProps { settings: Settings };

export default {
  namespaced: true,
  state: {
    settings: {}
  },
  actions: {
    update(context: ActionContext<StateProps, any>, settings: Partial<Settings>) {
      for(const setting of Object.keys(settings)) {
        context.state.settings[setting] = settings[setting];
      }

      return context.dispatch('sync', true);
    },
    sync(context: ActionContext<StateProps, any>, ours = false) {
      if(ours) {
        localStorage.setItem('settings', JSON.stringify(context.state.settings));
        return;
      }

      const localStorageSettings = localStorage.getItem('settings');
      context.state.settings =
        localStorageSettings ? JSON.parse(localStorageSettings) : defaultSettings
    }
  },
  getters: {
    get(state: StateProps) {
      return function (key: keyof Settings) {
        return state.settings ? state.settings[key] : defaultSettings[key];
      }
    },
    all(state: StateProps) {
      return state.settings || defaultSettings
    }
  },
};
