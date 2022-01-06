import {ActionContext} from 'vuex';

export interface Settings {
  showLatestEvent: boolean,
  locale: 'en-US' | 'ru-RU' | 'uz-UZ'
  ttsVoiceIndex: number | null
}

const defaultSettings: Settings = {
  showLatestEvent: true,
  locale: 'en-US',
  ttsVoiceIndex: null
}

interface StateProps  { settings: Settings };

export default {
  namespaced: true,
  state: {
    settings: {}
  },
  actions: {
    update(context: ActionContext<StateProps, any>, settings: Partial<Settings>) {
      const storageSettings =
        JSON.parse(localStorage.getItem('settings') || '{}');

      // NOTE: this is not safe? anybody can rewrite the local storage
      for(const setting of Object.keys(settings)) {
        storageSettings[setting] = settings[setting];
      }

      localStorage.setItem('settings', JSON.stringify(storageSettings));
      return context.dispatch('sync');
    },
    sync(context: ActionContext<StateProps, any>) {
      const localStorageSettings = JSON.parse(
        localStorage.getItem('settings') as string
      );
      context.state.settings = localStorageSettings;
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
