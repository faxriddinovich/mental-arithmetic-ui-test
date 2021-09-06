<template>
  <div>
    <div class="mt-3" v-if="event">
      <b-notification type="is-success" aria-close-label="Close notification">
        {{ event.body }}
      </b-notification>
    </div>
    <main-game-bar class="mt-1" />
    <courses />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from "@/services/database";
import { rpc } from "@/rpc/rpc";
import { RPC_GET_LATEST_EVENT_METHOD } from "@/rpc/methods";
import MainGameBar from "@/components/main-game-bar.vue";
import Courses from "@/components/course/courses.vue";

@Component({
  components: { MainGameBar, Courses },
})
export default class MainResource extends Vue {
  public event = false;
  async mounted() {
    const enabled = await Database.eventsEnabled();
    if (enabled) {
      const event = await rpc.call(RPC_GET_LATEST_EVENT_METHOD);
      this.event = event;
    }
  }
}
</script>
