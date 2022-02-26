import { defineStore } from "pinia";
import { acquireSync } from "@/store/sync";
import { SessionContract } from "@/services/rpc/contracts/account";

export interface Session extends SessionContract  {
  timestamp: number;
  isActive: boolean;
}

export const acquireAccount = defineStore({
  id: "Account",
  state: () => ({
    sessions: [] as Session[],
  }),
  getters: {
    activeSession(state) {
      return (
        state.sessions.find((session) => session.isActive === true) || null
      );
    },
  },
  actions: {
    addSession(session: SessionContract) {
      const _session = this.sessions.find((s) => s.id === session.id);
      const timestamp = new Date().getTime();

      if (_session) {
        _session.id = session.id;
        _session.username = session.username;
        _session.role = session.role;
        _session.session = session.session;
        _session.timestamp = timestamp;
      } else {
        this.sessions.push({
          id: session.id,
          username: session.username,
          role: session.role,
          session: session.session,
          timestamp: timestamp,
          isActive: !this.sessions.length ? true : false,
        });
      }

      return this.syncOurs();
    },
    setActiveSession(sessionId: number) {
      for (const session of this.sessions) {
        if (session.isActive) session.isActive = false;
        if (session.id === sessionId) {
          session.isActive = true;
        }
      }

      return this.syncOurs();
    },
    async deleteSession(sessionId: number) {
      let isActiveSession = false;

      const _sessions = this.sessions.filter((session) => {
        if (session.id === sessionId) {
          if (session.isActive) isActiveSession = true;
          return false;
        }
        return true;
      });

      if (isActiveSession && _sessions.length) {
        await this.setActiveSession(_sessions[0].id);
      }

      return this.syncOurs();
    },
    syncOurs() {
      return acquireSync().ours(this.$id, this.$state);
    },
    async syncTheirs() {
      this.$state = await acquireSync().theirs(this.$id);
    },
  },
});
