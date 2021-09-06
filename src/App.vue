<template>
  <div class="is-unselectable">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from "@/services/database";

@Component
export default class App extends Vue {
  async beforeMount() {
    await Database.tryInit();
  }
}
</script>

<style lang="scss">
// offline
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100&display=swap");
html,
body {
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background-color: #ecf3f4;
}
</style>
