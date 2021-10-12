import { LocalStorage } from "@/services/local-storage";

export default {
  state: {
    defaultSettings: [{ key: "show_latest_event", value: true }],
  },
  actions: {
    getSettings(context) {
      return LocalStorage.get("settings") || context.state.defaultSettings;
    },
    async getSetting(context, key) {
      const settings = await context.dispatch("getSettings");
      return settings.find((setting) => setting.key === key) || null;
    },
    updateSettings(context, settings) {
      LocalStorage.set("settings", settings);
    },
  },
};
