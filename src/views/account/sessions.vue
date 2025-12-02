<template>
  <div class="card p-3 is-bordered">
    <div class="mb-4 has-text-right">
      <b-button
        tag="router-link"
        :to="{ name: 'Authenticate' }"
        type="is-success"
        icon-left="plus"
        >{{ $t('add_account') }}</b-button
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
            >- {{ $t('active') }}</span
          >
          <br />
          {{ session.timestamp }}
        </div>
      </div>
      <div class="media-right buttons">
        <b-button
          size="is-small"
          type="is-primary"
          icon-left="arrow-right"
          v-if="!session.isActive"
          @click="setActiveSession(session.id)"
          >{{ $t('active_session') }}</b-button
        >
        <b-button
          size="is-small"
          type="is-danger"
          icon-left="trash-alt"
          @click="deleteSession(session.id)"
          >{{ $t('delete') }}</b-button
        >
      </div>
    </article>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "@vue/composition-api";
import { acquireAccount, Session } from "@/store/account";

export default defineComponent({
  setup(_, context) {
    const account = acquireAccount();
    const sessions = computed<Session[]>(() => {
      return account.sessions;
    });

    async function deleteSession(sessionId: number) {
      account.deleteSession(sessionId);
      context.root.$router.push({ name: "Home" });
    }

    async function setActiveSession(sessionId: number) {
      account.setActiveSession(sessionId);
      context.root.$router.push({ name: "Home" });
    }

    return { sessions, deleteSession, setActiveSession };
  },
});
</script>
