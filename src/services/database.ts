import { Dexie, Table } from "dexie";

interface Session {
  id?: number;
  username: string;
  session: string;
  date: string;
}

class AsyncDatabase extends Dexie {
  private sessions!: Table<Session, number>;

  constructor() {
    super("Mental-Arithmetic");
    this.version(3).stores({
      sessions: "++id, username, session, date, isCurrent"
    });
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
}

export const Database = new AsyncDatabase();
