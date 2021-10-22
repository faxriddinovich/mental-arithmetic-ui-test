<template>
  <div>
    <div class="card mb-3 p-4 is-bordered">
      <form @submit.prevent="createEvent">
        <b-field class="m-0" label="New event:">
          <b-input
            minlength="10"
            maxlength="255"
            type="textarea"
            v-model="eventBody"
            required
          ></b-input>
        </b-field>
        <div class="has-text-right">
          <b-button native-type="submit" icon-left="plus" type="is-success"
            >Create</b-button
          >
        </div>
      </form>
    </div>

    <div class="card p-3 is-bordered">
      <div v-if="events.length">
        <article
          class="media mb-0"
          v-for="(event, index) of events"
          :key="index"
        >
          <div class="media-content">
            <div class="content">
              <b-icon icon="mailbox" /> <span v-html="event.body" />
              <br />
              <small class="has-text-weight-semibold">{{
                event.createdAt
              }}</small>
            </div>
          </div>
          <div class="media-right">
            <button class="delete" @click="deleteEvent(event.id)"></button>
          </div>
        </article>
      </div>
      <div class="has-text-centered has-text-weight-semibold" v-else>
        No events found
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_EVENTS_METHOD,
  RPC_CREATE_EVENT_METHOD,
  RPC_DELETE_EVENT_METHOD,
} from "@/services/rpc/methods";

@Component
export default class ManageEvents extends Vue {
  public eventBody = "";
  public events = [];

  mounted() {
    this.getEvents();
  }

  public getEvents() {
    rpc.call(RPC_GET_EVENTS_METHOD).then((events) => {
      this.events = events;
    });
  }

  public createEvent() {
    rpc.call(RPC_CREATE_EVENT_METHOD, { body: this.eventBody }).then(() => {
      showToastMessage("Successfully created!", ToastType.Success);
      this.getEvents();
    });
  }

  public deleteEvent(eventId: number) {
    rpc.call(RPC_DELETE_EVENT_METHOD, { eventId }).then(() => {
      showToastMessage("Successfully deleted!", ToastType.Warning);
      this.getEvents();
    });
  }
}
</script>
