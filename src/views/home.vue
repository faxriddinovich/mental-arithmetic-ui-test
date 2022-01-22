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
            v-for="item of items"
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

        <courses :kind="0" />
      </b-tab-item>

      <b-tab-item value="other">
        <template #header>
          <b-icon icon="cube" class="mx-0" />
          <span class="is-hidden-mobile">{{ $t("other-resources") }}</span>
        </template>

        <div>
          <courses :kind="1" />
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
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import { Browser } from "@capacitor/browser";
import Courses from "@/views/course/courses.vue";
import { rpc } from "@/services/rpc";
import { RPC_GET_LATEST_EVENT_METHOD } from "@/services/rpc/methods";
import { EventContract } from "@/services/rpc/contracts/event";

export default defineComponent({
  components: { Courses },
  setup(_, context) {
    const activeSession = computed(
      () => context.root.$store.getters["Account/activeSession"]
    );
    const event = ref<EventContract | null>(null);

    const items = ref([
      { title: "Abacus", icon: "abacus", link: { name: "AbacusGameForm" } },
      {
        title: "Big numbers",
        icon: "10-plus",
        link: { name: "BigNumbersGameForm" },
      },
      { title: "Flash card", icon: "square-shape", link: "/" },
      { title: "Table", icon: "browser", link: "/" },
      { title: "Scores", icon: "chart-line", link: "/scores" },
      { title: "Settings", icon: "setting", link: "/settings" },
    ]);

    function getEvent() {
      const enabled =
        context.root.$store.getters["Settings/get"]("showLatestEvent");
      if (enabled) {
        rpc.call(RPC_GET_LATEST_EVENT_METHOD).then((result) => {
          event.value = result;
        });
      }
    }

    function changeTab(tab: string) {
      if (tab === "account") {
        if (activeSession.value) {
          context.root.$router.push({ name: "UpdateAccount" });
        } else {
          context.root.$router.push({ name: "Authenticate" });
        }
      }
    }

    function openPlayMarket() {
      Browser.open({ url: "market://details?=idorg.zwanoo.android.speedtest" });
    }

    function openAppStore() {
      //
    }

    onMounted(() => {
      getEvent();
    });

    return {
      activeSession,
      openAppStore,
      openPlayMarket,
      changeTab,
      items,
      event,
    };
  },
});
</script>
<style lang="scss">
@import "bulma/sass/utilities/initial-variables";
@import "bulma/sass/utilities/mixins";
// FIXME: rename me
.is-games-menu-text {
  font-weight: $weight-semibold;

  @include mobile {
    font-weight: $weight-normal;
  }
}
</style>
