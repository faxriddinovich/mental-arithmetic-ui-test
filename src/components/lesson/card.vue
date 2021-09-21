<template>
  <div
    :class="{
      card: true,
      'p-3': true,
      'is-bottom-bordered': true,
      'is-disabled': lesson.id != 9,
    }"
  >
    <div class="columns">
      <div class="column is-9-desktop">
        <span class="is-size-6">
          <span class="has-text-weight-bold">{{ idx }}. </span>
          <span class="has-text-weight-semibold">{{ lesson.title }}</span>
        </span>

        <b-tag type="is-success" class="has-text-weight-bold ml-1">NEW</b-tag>
      </div>
      <div class="column is-3-desktop">
        <div class="has-text-right pr-2">
          <span class="has-text-weight-semibold"
            ><b-icon icon="paperclip" />5</span
          >
          <span class="ml-1 has-text-weight-semibold"
            ><b-icon icon="ruler" />{{ lesson.tasks }}</span
          >
          <span class="ml-1 has-text-weight-semibold"
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
  @Prop(Number) public idx!: number;
}
</script>
<style lang="scss" scoped>
.is-disabled {
  background: rgba(255, 255, 255, 0.7);
  cursor: not-allowed;
}
.is-bottom-bordered {
  border: 1px solid rgb(149, 165, 166);
  border-bottom: 3px solid rgb(149, 165, 166);
}
.is-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
