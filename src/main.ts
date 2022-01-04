import Vue from "vue";
import Buefy from "buefy";
import { isMobile } from '@/services/platform';
import { SplashScreen } from '@capacitor/splash-screen';
//
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);

import App from "./App.vue";
// #!if __BROWSER__
import "./registerServiceWorker";
// #!endif
import router from "./router";
import i18n from "./i18n";
import store from "./store";

import "./styles/styles.scss";

import { SettingsStorage } from "@/services/storages/settings";

const buefyOptions = {
  defaultIconPack: "uil",
  customIconPacks: {
    uis: {
      sizes: {
        default: "is-size-6",
        "is-small": "is-size-3",
        "is-medium": "is-size-5",
      },
      iconPrefix: "uis-",
      internalIcons: {
        star: "star",
      },
    },
    uil: {
      sizes: {
        default: "is-size-5",
        "is-small": "",
        "is-medium": "is-size-3",
        "is-large": "is-size-1",
      },
      iconPrefix: "uil-",
      internalIcons: {
        check: "check",
        information: "information",
        "check-circle": "checkmark-circle",
        alert: "exclamation",
        "alert-circle": "exclamation-circle",
        "arrow-up": "arrow-up",
        "chevron-right": "angle-right",
        "chevron-left": "angle-left",
        "chevron-down": "arrow-down",
        eye: "eye",
        "eye-off": "eye-slash",
        "menu-down": "angle-down",
        "menu-up": "angle-up",
        "close-circle": "times-circle",
      },
    },
  },
};
Vue.use(Buefy, buefyOptions);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  mounted() {
    if(isMobile())
      SplashScreen.hide();
  },
}).$mount("#app");
