import { LocalStorage } from "@/services/local-storage";

export default {
  state: {
    cachedAccount: null,
    sessions: LocalStorage.get('sessions') || []
  },
  mutations: {
    setCachedAccount: (state, account) => {
      state.cachedAccount = account;
    },
    releaseCachedAccount: (state) => {
      state.cachedAccount = null;
    },
  },
  getters: {
    cachedAccount: (state) => state.cachedAccount,
    activeSession: (state) => {
      return state.sessions.find((session) => session.isActive === true);
		},
    sessions: (state) => state.sessions
  },
  actions: {
    getSessions() {
      return LocalStorage.get('sessions') || []
    },
    async addSession(context, session) {
      const sessions = await context.dispatch('getSessions');
      const _session = sessions.find((s) => s.id === session.id);
      const currTimestamp =(new Date).getTime();

      /* replace the target session with the existing one */
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
          isActive: !sessions.length ? true : false
        });
      }

      LocalStorage.set("sessions", sessions);
    },
    async setActiveSession(context, activeSessionId) {
      const sessions = await context.dispatch('getSessions');

      for (const session of sessions) {
        if (session.isActive) session.isActive = false;
        if (session.id === activeSessionId) {
          session.isActive = true;
        }
      }

      LocalStorage.set("sessions", sessions);
    },
    async deleteSession(context, sessionId) {
      const sessions = await context.dispatch('getSessions');
      let isActiveSession = false;

      const _sessions = sessions.filter(
        (session) => {
          if (session.id === sessionId) {
            if (session.isActive) isActiveSession = true;
            return false;
          }
          return true;
        }
      );

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
