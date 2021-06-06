<template>
  <b-button :type="(isOnline ? 'is-success' : 'is-danger') + ' is-light'" size="is-small" :icon-left="isOnline ? 'wifi' : 'wifi-slash'" active focused>
    {{ isOnline ? 'Connected' : 'No connection' }}
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ConnectionStatusComponent extends Vue {
  public isOnline = navigator.onLine;

  public get currentRouteName(): string | null | undefined {
    return this.$router.currentRoute.name;
  }

  public mounted() {
    window.addEventListener("online", this.setOnlineStatus);
    window.addEventListener("offline", this.setOnlineStatus);
  }

  public beforeDestroy() {
    window.removeEventListener("online", this.setOnlineStatus);
    window.removeEventListener("offline", this.setOnlineStatus);
  }

  public setOnlineStatus(status: Event): void {
    this.isOnline = status.type === "online" ? true : false;
  }
}
</script>
