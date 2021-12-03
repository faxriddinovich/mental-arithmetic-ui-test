import { Storage } from "@/services/platform";
import { SessionContract } from "@/services/rpc/contracts/account";

export interface Session {
  id: number;
  username: string;
  role: string;
  session: string;
  timestamp: number;
  isActive: boolean;
}

export class StaticSessionStorage {
  private readonly storageKey = "sessions";

  public async getSessions(): Promise<Session[]> {
    const sessions = await Storage.get(this.storageKey);
    return sessions ? JSON.parse(sessions) : [];
  }

  public async getActiveSession(): Promise<Session | null> {
    const sessions = await this.getSessions();
    return sessions.find((session) => session.isActive === true) || null;
  }

  public async setSessions(sessions: Session[]) {
    Storage.set(this.storageKey, JSON.stringify(sessions));
  }

  public async setActiveSession(sessionId: number) {
    const sessions = await this.getSessions();

    for (const session of sessions) {
      if (session.isActive) session.isActive = false;
      if (session.id === sessionId) {
        session.isActive = true;
      }
    }

    this.setSessions(sessions);
  }

  /*
   * Add a sesssion to the sessions list. If the target session
   * already exists, then this action just replaces the target
   * session with the existing one.
   */
  public async addSession(session: SessionContract) {
    const sessions = await this.getSessions();
    const _session = sessions.find((s) => s.id === session.id);
    const timestamp = new Date().getTime();

    if (_session) {
      _session.id = session.id;
      _session.username = session.username;
      _session.role = session.role;
      _session.session = session.session;
      _session.timestamp = timestamp;
    } else {
      sessions.push({
        id: session.id,
        username: session.username,
        role: session.role,
        session: session.session,
        timestamp: timestamp,
        isActive: !sessions.length ? true : false,
      });
    }

    await this.setSessions(sessions);
    await this.setActiveSession(session.id);
  }

  public async deleteSession(sessionId: number) {
    const sessions = await this.getSessions();
    let isActiveSession = false;

    const _sessions = sessions.filter((session) => {
      if (session.id === sessionId) {
        if (session.isActive) isActiveSession = true;
        return false;
      }
      return true;
    });

    await this.setSessions(_sessions);

    /*
     * If the target session is active, then we should make the first
     * session active in the session list
     */
    if (isActiveSession && _sessions.length) {
      await this.setActiveSession(_sessions[0].id);
    }
  }
}

export const SessionStorage = new StaticSessionStorage();
