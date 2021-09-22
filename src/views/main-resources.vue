<template>
  <div>
    <div class="mt-3" v-if="event">
      <b-notification type="is-success" aria-close-label="Close notification">
        {{ event.body }}
      </b-notification>
    </div>
    <div class="columns is-variable is-2 is-mobile is-multiline mt-2">
      <div
        class="column is-4-mobile is-4-tablet is-2-desktop"
        v-for="item of items"
        :key="item.icon"
      >
        <router-link
          :to="item.link"
          class="
            card
            is-clickable is-flex is-flex-direction-column is-align-items-center
            py-4
          "
        >
          <b-icon :icon="item.icon" type="is-primary" size="is-large" />
          <span class="has-text-weight-semibold mt-1">{{ item.title }}</span>
        </router-link>
      </div>
    </div>
    <courses res="main" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from "@/services/indexeddb/database";
import { rpc } from "@/rpc/rpc";
import { RPC_GET_LATEST_EVENT_METHOD } from "@/rpc/methods";
import Courses from "@/views/course/courses.vue";

@Component({
  components: { Courses },
})
export default class MainResource extends Vue {
  public event = false;
  public items = [
    { title: "Abacus", icon: "abacus", link: "/" },
    { title: "Numbers", icon: "10-plus", link: "/" },
    { title: "Flash card", icon: "square-shape", link: "/" },
    { title: "Table", icon: "browser", link: "/" },
    { title: "Scores", icon: "chart-line", link: "/scores" },
    { title: "Settings", icon: "setting", link: "/settings" },
  ];
  async mounted() {
    const enabled = await Database.eventsEnabled();
    if (enabled) {
      const event = await rpc.call(RPC_GET_LATEST_EVENT_METHOD);
      this.event = event;
    }
  }
}
</script>
