<template>
  <div class="is-unselectable">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from "@/services/indexeddb/database";

@Component
export default class App extends Vue {
  async beforeMount() {
    await Database.tryInit();
  }
}
</script>

<style lang="scss">
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";
@import "https://unicons.iconscout.com/release/v4.0.0/css/solid.css";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100&display=swap");

html,
body {
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  background-color: #ecf3f4;
}

::-webkit-scrollbar {
  width: 0;
}

.is-bottom-left {
  position: absolute;
  bottom: 6px;
  left: 6px;
}
</style>
