import {ActionContext} from 'vuex';

export interface Settings {
  showLatestEvent: boolean,
  locale: 'en-US' | 'ru-RU' | 'uz-UZ'
}

const defaultSettings: Settings = {
  showLatestEvent: true,
  locale: 'en-US'
}

interface StateProps  { settings: Settings };

export default {
  namespaced: true,
  state: {
    settings: null
  },
  actions: {
    update(context: ActionContext<StateProps, any>, settings: Partial<Settings>) {
      localStorage.setItem('settings', JSON.stringify(settings));
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
