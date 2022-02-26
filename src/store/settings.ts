import { defineStore } from "pinia";
import { acquireSync } from './sync';

export type Locales = 'en-US' | 'ru-RU' | 'uz-UZ';

interface Settings {
  show_latest_event: boolean,
  text_to_speech_id: number | null,
  locale: Locales
}

export const acquireSetting = defineStore({
  id: "Setting",
  state: () => ({
    show_latest_event: true,
    text_to_speech_id: 32,
    locale: "en-US"
  }),
  actions: {
    change(settings: Partial<Settings>) {
      const applyKeys = Object.keys(settings) as (keyof Settings)[];
      for(const setting of applyKeys) {
        //@ts-ignore
        this[setting] = settings[setting];
      }

      return this.syncOurs();
    },
    syncOurs() {
      return acquireSync().ours(this.$id, this.$state);
    },
    async syncTheirs() {
      this.$state = await acquireSync().theirs(this.$id);
      console.log(this.$state);
    }
  },
  getters: {
    one() {
      return (key: keyof Settings) =>  {
        return this[key];
      }
    },
    all(state) {
      return state;
    }
  }
});
