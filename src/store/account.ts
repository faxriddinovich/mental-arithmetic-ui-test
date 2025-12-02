import { defineStore } from "pinia";
import { acquireSync } from "@/store/sync";
import { SessionContract } from "@/services/rpc/contracts/account";

export interface Session extends SessionContract {
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
      const timestamp = new Date().getTime();
      const _session = this.sessions.find((s) => s.id === session.id);

      for (const session of this.sessions) session.isActive = false;

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
          isActive: true,
        });
      }

      return this.syncOurs();
    },
    setActiveSession(accountId: number) {
      for (const session of this.sessions) {
        session.isActive = false;
        if (session.id === accountId) session.isActive = true;
      }

      return this.syncOurs();
    },
    async deleteSession(accountId: number) {
      let targetIsActive = false;

      for (const [index, session] of this.sessions.entries()) {
        if (session.id === accountId) {
          // remove the target session
          this.sessions.splice(index, 1);
          // is the target session active?
          if (session.isActive) targetIsActive = true;
        }
      }

      // the target session was active and there are sessions left
      if (targetIsActive && this.sessions.length) {
        // set the first session as active
        await this.setActiveSession(this.sessions[0].id);
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
