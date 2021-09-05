<template>
  <div>
    <div class="mt-3">
      <b-notification type="is-success" aria-close-label="Close notification">
        🎉 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id
        fermentum quam. Proin sagitti
      </b-notification>
    </div>
    <main-game-bar class="mt-1" />
    <courses />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainGameBar from "@/components/main-game-bar.vue";
import Courses from "@/components/course/courses.vue";

@Component({
  components: { MainGameBar, Courses },
})
export default class OtherResources extends Vue {}
</script>
