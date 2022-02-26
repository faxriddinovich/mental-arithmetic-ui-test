import { defineStore } from "pinia";
import { Storage } from '@capacitor/storage';

type SyncValues = { [key: string]: any };

export const acquireSync = defineStore({
  id: "Sync",
  actions: {
    async ours(key: string, vals: SyncValues) {
      return Storage.set({ key, value: JSON.stringify(vals) });
    },
    async theirs(key: string) {
      const raw = await Storage.get({ key });
      return JSON.parse(raw.value!);
    }
  }
});
