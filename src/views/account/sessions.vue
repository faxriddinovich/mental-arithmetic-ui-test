<template>
  <div class="card p-2 is-bordered">
    <div class="mb-2 has-text-right">
      <b-button
        tag="router-link"
        :to="{ name: 'Authenticate' }"
        type="is-success"
        icon-left="plus"
        >Add session</b-button
      >
    </div>
    <div
      class="is-flex is-justify-content-space-between is-align-items-center p-2"
      v-for="(session, index) of sessions"
      :key="index"
    >
      <span><b-icon icon="user" /> {{ session.username }}</span>

      <div class="buttons">
        <b-button
          size="is-small"
          type="is-danger"
          icon-left="trash-alt"
          @click="deleteSession(session.id)"
          >Delete</b-button
        >
        <b-button
          size="is-small"
          type="is-primary"
          icon-left="arrow-right"
          v-if="!session.isActive"
          @click="setActiveSession(session.id)"
          >Enter</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from 'vuex';
import { SessionContract } from '@/rpc/contracts/account';

@Component({ computed: { ...mapGetters(['sessions']) } })
export default class Sessions extends Vue {
  public sessions!: SessionContract[];

  mounted() { console.log(this.$store.getters.sessions) }

  public deleteSession(id: number) {
    this.$store.dispatch('deleteSession', id);
    this.$router.go(0);
  }

  public setActiveSession(id: number) {
    this.$store.dispatch('setActiveSession', id);
    this.$router.go(0);
  }
}
</script>
