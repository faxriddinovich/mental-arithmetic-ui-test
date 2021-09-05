import { Dexie, Table } from "dexie";

interface Session {
  id?: number;
  username: string;
  session: string;
  date: string;
}

class AsyncDatabase extends Dexie {
  public static db = "Mental-Arithmetic";
  private sessions!: Table<Session, number>;

  constructor() {
    super(AsyncDatabase.db);
    this.version(4).stores({
      sessions: "++id, username, session, date, isCurrent",
      configs: "++id, key, value"
    });
  }

  public async tryInit() {
    const configs = this.table("configs");

    if(!(await configs.count())) {
      await configs.bulkAdd([
        { key: "show_latest_event", value: 1 }
      ]);
    }
  }

  public async addSession(username: string, session: string) {
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
    const conf = await this.table("configs").where({ key: "show_latest_event" }).first();
    return conf ? conf.value : true;
  }
}

export const Database = new AsyncDatabase();
