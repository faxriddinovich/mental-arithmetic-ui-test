<template>
  <div class="card p-2 is-bordered">
  <div class="mb-2 has-text-right"><b-button tag="router-link" :to="{ name: 'Authenticate' }" type="is-success" icon-left="plus">Add session</b-button></div>
    <div class="is-flex is-justify-content-space-between is-align-items-center p-2" v-for="(session, index) of sessions" :key="index">
      <span><b-icon icon="user" /> {{ session.username }}</span>

      <div class="buttons">
        <b-button size="is-small" type="is-danger" icon-left="trash-alt" @click="deleteSession(session.id)">Delete</b-button>
        <b-button size="is-small" type="is-primary" icon-left="arrow-right" v-if="!session.isCurrent" @click="setCurrentSession(session.id)">Enter</b-button>
      </div>

    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from '@/services/indexeddb/database';

@Component
export default class Sessions extends Vue {
  public sessions = null;

  mounted() {
    Database.getSessions().then((sessions) => this.sessions = sessions);
  }

  public deleteSession(id: number) {
    Database.deleteSession(id).then(() => {
      this.$router.go(0);
    });
  }

  public setCurrentSession(id: number) {
    Database.setCurrentSession(id).then(() => {
      this.$router.go(0);
    });
  }
}
</script>
