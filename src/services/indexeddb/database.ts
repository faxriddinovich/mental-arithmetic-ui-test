import { Dexie, Table } from "dexie";
import { Session, Setting } from "./interfaces";
import { AuthAccountContract } from "@/rpc/contracts/account";

class AsyncDatabase extends Dexie {
  public static db = "Mental-Arithmetic";

  constructor() {
    super(AsyncDatabase.db);
    this.version(6).stores({
      sessions: "++id, username, session, role, isCurrent, date",
      settings: "&key, value",
    });
  }

  public async tryInit() {
    const settings = this.table("settings");

    if (!(await settings.count())) {
      await settings.bulkAdd([{ key: "show_latest_event", value: true }]);
    }
  }

  public async addSession(account: AuthAccountContract) {
    const { username, session, role } = account;
    const sessionsTable = this.table("sessions");
    const hasCurrent = await sessionsTable.where({ isCurrent: 1 }).first();
    const existingSession = sessionsTable.where({ username });

    // check if the session already exists
    if (await existingSession.count()) {
      // we should just replace with a new session token
      await existingSession.modify({ session });
      return;
    }

    const date = new Date().toUTCString();
    await sessionsTable.add({
      username,
      session,
      role,
      date,
      isCurrent: !hasCurrent ? 1 : 0,
    });
  }

  public getSessions(): Promise<Session[]> {
    return this.table("sessions").toArray();
  }

  public getCurrentSession(): Promise<Session | undefined> {
    return this.table("sessions").where({ isCurrent: 1 }).first();
  }

  public async eventsEnabled() {
    const setting = await this.table("settings")
      .where({ key: "show_latest_event" })
      .first();
    return setting.value;
  }

  public getSettings(): Promise<Setting[]> {
    return this.table("settings").toArray();
  }

  public async applySettings(settings: Setting[]) {
    await this.table("settings").bulkPut(settings);
  }
}

export const Database = new AsyncDatabase();
