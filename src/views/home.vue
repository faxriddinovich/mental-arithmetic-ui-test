<template>
  <div
    class="container is-max-widescreen pt-4 px-3"
    style="padding-bottom: 100px"
  >
    <nav
      class="navbar is-fixed-bottom is-bordered p-2 is-justify-content-center"
      role="navigation"
    >
      <div class="has-text-centered">
        <div class="mb-2 is-size-6-fullhd is-size-7-touch">
          Download our offline
          <span class="is-underlined has-text-weight-semibold">mobile</span> or
          <span class="is-underlined has-text-weight-semibold">desktop</span>
          app from the website or:
        </div>
        <img
          src="https://miro.medium.com/max/600/1*xqT83bMEz92IBYxS9UQNow.png"
          class="is-clickable"
          @click="openAppStore"
          width="140"
        />
        <img
          src="https://miro.medium.com/max/600/1*nZu0dsnlCQltPT1QMCHFAA.png"
          class="is-clickable ml-4"
          @click="openPlayMarket"
          width="140"
        />
      </div>
    </nav>

    <b-tabs
      type="is-toggle"
      class="is-nav-tabs"
      :animated="false"
      @input="changeTab"
      destroy-on-hide
      expanded
    >
      <b-tab-item value="main">
        <template #header>
          <b-icon icon="abacus" class="mx-0" />
          <span class="is-hidden-mobile">{{ $t("mental-arithmetic") }}</span>
        </template>

        <b-message
          type="is-info"
          class="is-event"
          v-if="event"
          icon="mailbox"
          icon-size="is-medium"
          has-icon
        >
          <div class="mb-1" v-html="event.body"></div>
          <small class="has-text-weight-bold">{{ event.createdAt }}</small>
        </b-message>

        <div class="columns is-variable is-2 is-mobile is-multiline">
          <div
            class="column is-4-mobile is-4-tablet is-2-desktop"
            v-for="item of mainItems"
            :key="item.icon"
          >
            <router-link
              :to="item.link"
              class="
                card
                is-clickable
                is-flex
                is-flex-direction-column
                is-align-items-center
                py-4
              "
            >
              <b-icon :icon="item.icon" type="is-primary" size="is-large" />
              <span class="has-text-weight-semibold-tablet mt-1">{{
                item.title
              }}</span>
            </router-link>
          </div>
        </div>

        <courses res="main" />
      </b-tab-item>

      <b-tab-item value="other">
        <template #header>
          <b-icon icon="cube" class="mx-0" />
          <span class="is-hidden-mobile">{{ $t("other-resources") }}</span>
        </template>

        <div>
          <courses res="other" />
        </div>
      </b-tab-item>
      <b-tab-item value="account">
        <template #header>
          <b-icon icon="user" class="mx-0" />
          <span class="is-hidden-mobile">{{
            activeSession ? $t("account") : $t("authenticate")
          }}</span>
        </template>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Browser } from "@capacitor/browser";
import Courses from "@/views/course/courses.vue";
import { rpc } from "@/services/rpc";
import { RPC_GET_LATEST_EVENT_METHOD } from "@/services/rpc/methods";
import { EventContract } from "@/services/rpc/contracts/event";
import { SettingsStorage } from "@/services/storages/settings";
import { Session, SessionStorage } from "@/services/storages/session";

@Component({
  components: { Courses },
})
export default class Home extends Vue {
  public activeSession: Session | null = null;
  public event: EventContract | null = null;

  public mainItems = [
    { title: "Abacus", icon: "abacus", link: "/" },
    { title: "Numbers", icon: "10-plus", link: { name: "NumbersGame" } },
    { title: "Flash card", icon: "square-shape", link: "/" },
    { title: "Table", icon: "browser", link: "/" },
    { title: "Scores", icon: "chart-line", link: "/scores" },
    { title: "Settings", icon: "setting", link: "/settings" },
  ];

  async mounted() {
    this.getActiveSession();
    this.loadLatestEvent();
  }

  public openPlayMarket() {
    Browser.open({ url: "market://details?=idorg.zwanoo.android.speedtest" });
  }

  public openAppStore() {
    // pass
  }

  public loadLatestEvent() {
    SettingsStorage.getSetting("show_latest_event").then((canShow) => {
      if (canShow) {
        rpc.call(RPC_GET_LATEST_EVENT_METHOD).then((event: EventContract) => {
          this.event = event;
        });
      }
    });
  }

  public getActiveSession() {
    SessionStorage.getActiveSession().then((session) => {
      this.activeSession = session;
    });
  }

  public changeTab(tab: string) {
    if (tab === "account") {
      if (this.activeSession) {
        this.$router.push({ name: "UpdateAccount" });
      } else {
        this.$router.push({ name: "Authenticate" });
      }
    }
  }
}
</script>
<style lang="scss">
@import "bulma/sass/utilities/initial-variables";
@import "bulma/sass/utilities/mixins";

.is-nav-tabs > .tabs {
  background: white;
  border-radius: 0.25rem;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.is-nav-tabs > .tab-content {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.is-nav-tabs.b-tabs {
  margin-bottom: 0px !important;
}

// FIXME: rename me
.is-games-menu-text {
  font-weight: $weight-semibold;

  @include mobile {
    font-weight: $weight-normal;
  }
}
</style>
