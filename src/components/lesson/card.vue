<template>
  <div class="card p-3">
    <div class="columns">
      <div class="column is-9-desktop">
        <span class="is-size-6 has-text-weight-semibold">{{
          lesson.title
        }}</span>
      </div>
      <div class="column is-3-desktop">
        <div class="has-text-right pr-2">
          <span class="has-text-weight-semibold"
            ><b-icon icon="paperclip" />5</span
          >
          <span class="ml-2 has-text-weight-semibold"
            ><b-icon icon="ruler" />{{ lesson.tasks }}</span
          >
          <span class="ml-2 has-text-weight-semibold"
            ><b-icon icon="comment-dots" />{{ lesson.comments }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Lessons extends Vue {
  @Prop(Object) public lesson;
}
</script>
<style lang="scss" scoped>
.is-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
