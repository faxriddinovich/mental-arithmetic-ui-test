<template>
  <div class="card" style="border: 1px solid rgb(171, 183, 183)">
    <div class="p-3">
      <div class="is-flex is-justify-content-space-between">
        <div class="has-text-weight-semibold has-text-underlined is-size-5">
          {{ lesson.title }}
        </div>
        <b-tag
          type="is-success"
          class="p-2 ml-2 is-size-8 has-text-weight-semibold"
          >NEW</b-tag
        >
      </div>
    </div>
    <div class="card-footer">
      <div class="card-footer-item p-2">
        <b-icon icon="play" /><span class="has-text-weight-semibold">23</span>
      </div>
      <div class="card-footer-item p-2">
        <b-icon icon="ruler" /><span class="has-text-weight-semibold">{{
          lesson.tasks
        }}</span>
      </div>
      <div class="card-footer-item p-2">
        <b-icon icon="comment-dots" /><span class="has-text-weight-semibold">{{
          lesson.comments
        }}</span>
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
