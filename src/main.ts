import Vue from "vue";
import Chakra, { CThemeProvider, CReset } from "@chakra-ui/vue";
import Unicon from "vue-unicons/dist/vue-unicons-vue2.umd";
import {
  uniUser,
  uniKeyholeCircle,
  uniUserCheck,
  uniEnvelope,
  uniExternalLinkAlt,
  uniUserPlus,
} from "vue-unicons/dist/icons";

Unicon.add([
  uniUser,
  uniUserPlus,
  uniKeyholeCircle,
  uniUserCheck,
  uniEnvelope,
  uniExternalLinkAlt,
]);

import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.use(Chakra);
Vue.use(Unicon);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(CThemeProvider, [h(CReset), h(App)]),
}).$mount("#app");
