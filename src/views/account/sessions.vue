<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-desktop is-12-mobile is-9-tablet">
      <div class="card p-3 is-bordered">
        <div class="mb-4 has-text-right">
          <b-button
            tag="router-link"
            :to="{ name: 'Authenticate' }"
            type="is-success"
            icon-left="plus"
            >Add account</b-button
          >
        </div>

        <article
          class="media py-1 my-1"
          v-for="(session, index) of sessions"
          :key="index"
        >
          <figure class="media-left">
            <b-icon icon="user" size="is-medium" />
          </figure>
          <div class="media-content">
            <div class="content">
              <strong>{{ session.username }}</strong> #{{ session.id }}
              <span
                v-if="session.isActive"
                class="has-text-weight-bold has-text-success"
                >- Active</span
              >
              <br />
              {{ session.timestamp }}
            </div>
          </div>
          <div class="media-right buttons">
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
        </article>
      </div>
      <b-button
        class="mt-3"
        icon-left="home"
        tag="router-link"
        :to="{ name: 'Home' }"
        expanded
        >Home</b-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Session, SessionStorage } from "@/services/storages/session";

@Component
export default class Sessions extends Vue {
  public sessions: Session[] | null = null;

  mounted() {
    this.getSessions();
  }

  public getSessions() {
    SessionStorage.getSessions().then((sessions) => {
      this.sessions = sessions;
    });
  }

  public async deleteSession(sessionId: number) {
    SessionStorage.deleteSession(sessionId).then(() => {
      SessionStorage.getActiveSession().then((activeSession) => {
        if (!activeSession) return this.$router.push({ name: "Home" });
        this.$router.go(0);
      });
    });
  }

  public setActiveSession(sessionId: number) {
    SessionStorage.setActiveSession(sessionId).then(() => this.$router.go(0));
  }
}
</script>
