type KeyValue = { [key: string]; any };

export class LocalStorage {
  private static deserialize(str: string): any {
    return JSON.parse(str);
  }

  private static serialize(obj: any): string {
    return JSON.stringify(obj);
  }

  public static set(key: string, value: KeyValue | KeyValue[]): void {
    localStorage.setItem(key, LocalStorage.serialize(value));
  }

  public static get<T extends KeyValue>(key: string): T | null {
    const storageValue = localStorage.getItem(key);
    return storageValue === null
      ? null
      : LocalStorage.deserialize(storageValue);
  }

  public clear() {
    localStorage.clear();
  }
}
