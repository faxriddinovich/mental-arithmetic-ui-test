import {ActionContext} from 'vuex';
import {SessionContract} from '@/services/rpc/contracts/account';

export interface Session extends SessionContract {
  timestamp: number,
  isActive: boolean
};

interface StateProps {
  sessions: Session[]
}

export default {
  namespaced: true,
  state: {
    sessions: []
  },
  getters: {
    activeSession(state: StateProps) {
      return state.sessions.find((session) => session.isActive === true) || null;
    },

    sessions(state: StateProps) {
      return state.sessions;
    }
  },
  actions: {
    sync(context: ActionContext<StateProps, any>, ours = false) {
      if (ours) {
        localStorage.setItem('sessions', JSON.stringify(context.state.sessions));
        return;
      }

      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      context.state.sessions.push(...sessions);
    },

    addSession(context: ActionContext<StateProps, any>, session: Session) {
      const _session = context.state.sessions.find((s) => s.id === session.id);
      const timestamp = new Date().getTime();

      if (_session) {
        _session.id = session.id;
        _session.username = session.username;
        _session.role = session.role;
        _session.session = session.session;
        _session.timestamp = timestamp;
      } else {
        context.state.sessions.push({
          id: session.id,
          username: session.username,
          role: session.role,
          session: session.session,
          timestamp: timestamp,
          isActive: !context.state.sessions.length ? true : false,
        });
      }

      return context.dispatch('sync', true);
    },

    setActiveSession(context: ActionContext<StateProps, any>, sessionId: number) {
      for (const session of context.state.sessions) {
        if (session.isActive) session.isActive = false;
        if (session.id === sessionId) {
          session.isActive = true;
        }
      }

      return context.dispatch('sync', true);
    },

    async deleteSession(context: ActionContext<StateProps, any>, sessionId: number) {
      let isActiveSession = false;

      const _sessions = context.state.sessions.filter((session) => {
        if (session.id === sessionId) {
          if (session.isActive) isActiveSession = true;
          return false;
        }
        return true;
      });

      if (isActiveSession && _sessions.length) {
        await context.dispatch('setActiveSession', _sessions[0].id);
      }

      return context.dispatch('sync', true);
    }
  },
};
