import {Plugins} from '@capacitor/core';

class StaticStorage {

  private serialize(obj: any) {
    return JSON.stringify(obj);
  }

  public async get<T = string>(key: string): Promise<T> {
    return (await Plugins.Storage.get({key})).value as any as T;
  }

  public async set(key: string, value: any): Promise<void> {
    const serialized = typeof value !== "string" ? this.serialize(value) : value;
    return await Plugins.Storage.set({key, value: serialized});
  }

  public clear(): Promise<void> {
    return Plugins.Storage.clear();
  }
}

export const Storage = new StaticStorage();
