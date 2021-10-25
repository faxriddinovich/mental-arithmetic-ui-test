import { LocalStorage } from "@/services/local-storage";

export default {
  getters: {
    sessions: (state) => state.sessions,
  },
  actions: {
    /*
     * We could just store sessions in state. But localstorage is not
     * reactive. So we have to call this action every time to get list of
     * sessions.
     */
    getSessions() {
      return LocalStorage.get("sessions") || [];
    },

    async getActiveSession(context) {
      const sessions = await context.dispatch("getSessions");
      return sessions.find((session) => session.isActive === true) || null;
    },

    /*
     * Add a sesssion to the sessions list. If the target session
     * already exists, then this action just replaces the target
     * session with the existing one.
     */
    async addSession(context, session) {
      const sessions = await context.dispatch("getSessions");
      const _session = sessions.find((s) => s.id === session.id);
      const currTimestamp = new Date().getTime();

      if (_session) {
        _session.id = session.id;
        _session.username = session.username;
        _session.role = session.role;
        _session.session = session.session;
        _session.timestamp = currTimestamp;
      } else {
        sessions.push({
          id: session.id,
          username: session.username,
          role: session.role,
          session: session.session,
          timestamp: currTimestamp,
          isActive: !sessions.length ? true : false,
        });
      }

      LocalStorage.set("sessions", sessions);
    },
    async setActiveSession(context, activeSessionId) {
      const sessions = await context.dispatch("getSessions");

      for (const session of sessions) {
        if (session.isActive) session.isActive = false;
        if (session.id === activeSessionId) {
          session.isActive = true;
        }
      }

      LocalStorage.set("sessions", sessions);
    },
    async deleteSession(context, sessionId) {
      const sessions = await context.dispatch("getSessions");
      let isActiveSession = false;

      const _sessions = sessions.filter((session) => {
        if (session.id === sessionId) {
          if (session.isActive) isActiveSession = true;
          return false;
        }
        return true;
      });

      LocalStorage.set("sessions", _sessions);

      /*
       * If the target session is active, then we should make the first
       * session active in the session list
       */
      if (isActiveSession && _sessions.length) {
        context.dispatch("setActiveSession", _sessions[0].id);
      }
    },
  },
};
