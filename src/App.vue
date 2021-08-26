<template>
  <c-box
    bg="gray.100"
    min-width="min-content"
    min-height="100vh"
    overflow="auto"
  >
    <router-view />
  </c-box>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CBox } from "@chakra-ui/vue";

@Component({ components: { CBox } })
export default class App extends Vue {}
</script>
