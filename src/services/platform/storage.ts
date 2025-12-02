import { Storage as CapStorage } from "@capacitor/storage";

class StaticStorage {
  public serialize(obj: any) {
    return JSON.stringify(obj);
  }

  public async get<T = string>(key: string): Promise<T> {
    return (await CapStorage.get({ key })).value as any as T;
  }

  public async set(key: string, value: any): Promise<void> {
    const serialized =
      typeof value !== "string" ? this.serialize(value) : value;
    return await CapStorage.set({ key, value: serialized });
  }

  public clear(): Promise<void> {
    return CapStorage.clear();
  }
}

export const Storage = new StaticStorage();
