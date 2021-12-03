import { Storage } from "@/services/platform";

export interface Setting {
  key: string;
  value: any;
}

export class StaticSettingsStorage {
  private readonly storageKey = "settings";
  private defaultSettings: Setting[] = [
    { key: "show_latest_event", value: true },
    { key: "locale", value: "en" },
  ];

  public async getSettings(): Promise<Setting[]> {
    const settings = await Storage.get(this.storageKey);
    return settings ? JSON.parse(settings) : this.defaultSettings;
  }

  public lookup(settings: Setting[], key: string) {
    return settings.find((setting) => setting.key === key);
  }

  public async getSetting(key: string): Promise<any> {
    const settings = await this.getSettings();
    return this.lookup(settings ? settings : this.defaultSettings, key)!.value;
  }

  public async setSettings(settings: Setting[]): Promise<void> {
    await Storage.set(this.storageKey, JSON.stringify(settings));
  }
}

export const SettingsStorage = new StaticSettingsStorage();
