<template>
  <div class="card is-flex is-rounded is-clipped">
    <div
      v-for="item of items"
      :key="item.icon"
      :class="
        'is-flex is-justify-content-center p-2 is-align-items-center is-flex-grow-1 '.concat(
          $route.path === item.path
            ? 'has-background-primary has-text-white'
            : 'is-clickable'
        )
      "
      @click="go(item.path)"
    >
      <b-icon :icon="item.icon" />
      <span class="is-hidden-mobile">{{ item.title }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class MainTopBar extends Vue {
  public items = [
    { path: "/", icon: "abacus", title: "Mental arithmetic" },
    { path: "/other-resources", icon: "cube", title: "Other resources" },
    { path: "/user/enter-profile", icon: "user", title: "Profile" },
  ];

  public go(path: string) {
    this.$router.push(path);
  }
}
</script>
