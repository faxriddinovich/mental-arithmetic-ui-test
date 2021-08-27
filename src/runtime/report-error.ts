import store from '@/store';
import router from '@/router';

export function reportError(error: Error) {
  store.commit('setRuntimeError', error);
  router.push({ name: "report-error" });
}
