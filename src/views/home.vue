<template>
  <div class="container is-max-widescreen pt-4 px-3">
    <div class="card">
      <div class="tabs is-toggle is-fullwidth">
        <ul>
          <li :class="$route.path === '/' && 'is-active is-disabled'">
            <router-link to="/">
              <b-icon icon="abacus" class="mx-0" />
              <span class="is-hidden-mobile">Mental arithmetic</span>
            </router-link>
          </li>
          <li
            :class="
              $route.path === '/other-resources' && 'is-active is-disabled'
            "
          >
            <router-link to="/other-resources">
              <b-icon icon="cube" class="mx-0" />
              <span class="is-hidden-mobile">Other resources</span>
            </router-link>
          </li>
          <li>
            <router-link
              :to="activeSession ? '/account' : '/account/authenticate'"
            >
              <b-icon icon="user" class="mx-0" />
              <span class="is-hidden-mobile">{{
                activeSession ? activeSession.username : "Account"
              }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { SessionContract } from "@/rpc/contracts/account";

@Component
export default class Home extends Vue {
  public activeSession!: SessionContract | null = null;

  mounted() {
    this.$store.dispatch("getActiveSession").then((session) => {
      this.activeSession = session;
    });
  }
}
</script>
