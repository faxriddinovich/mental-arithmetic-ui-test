<template>
  <div>
    <div class="card mb-3 p-4 is-bordered">
      <form @submit.prevent="createEvent">
        <b-field class="m-0" :label="$t('new_event')">
          <b-input
            minlength="10"
            maxlength="255"
            type="textarea"
            v-model="event"
            required
          ></b-input>
        </b-field>
        <div class="has-text-right">
          <b-button native-type="submit" icon-left="plus" type="is-success">{{
            $t("create")
          }}</b-button>
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
        {{ $t("no_events_found") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_EVENTS_METHOD,
  RPC_CREATE_EVENT_METHOD,
  RPC_DELETE_EVENT_METHOD,
} from "@/services/rpc/methods";

export default defineComponent({
  setup(_, context) {
    const event = ref<string>("");
    const events = ref<string[]>([]);

    function getEvents() {
      rpc.call(RPC_GET_EVENTS_METHOD).then((remoteEvents) => {
        events.value = remoteEvents;
      });
    }

    function createEvent() {
      rpc.call(RPC_CREATE_EVENT_METHOD, { body: event.value }).then(() => {
        showToastMessage(
          context.root.$i18n.t("successfully_created") as string,
          ToastType.Success
        );
        getEvents();
      });
    }

    function deleteEvent(eventId: number) {
      rpc.call(RPC_DELETE_EVENT_METHOD, { eventId }).then(() => {
        showToastMessage(
          context.root.$i18n.t("successfully_deleted") as string,
          ToastType.Warning
        );
        getEvents();
      });
    }

    onMounted(() => {
      getEvents();
    });

    return { event, events, createEvent, deleteEvent };
  },
});
</script>
