<template>
  <router-link :to="{ name: 'Lesson', params: { id: lesson.id } }">
    <div class="card p-3 is-bordered-bottom-accent">
      <div class="columns">
        <div class="column is-9-desktop">
          <span class="is-size-6">
            <span class="has-text-weight-bold">{{ idx }}. </span>
            <span class="has-text-weight-semibold">{{ lesson.title }}</span>
          </span>

          <span class="ml-1">
            <b-tag
              type="is-primary"
              class="has-text-weight-bold ml-1"
              v-if="lesson.isTrial"
              >TRIAL</b-tag
            >
            <b-tag
              type="is-success"
              class="has-text-weight-bold ml-1"
              v-if="isNew(lesson.createdAt)"
              >NEW</b-tag
            >
          </span>
        </div>
        <div class="column is-3-desktop">
          <div class="has-text-right pr-2">
            <span class="has-text-weight-semibold"
              ><b-icon icon="paperclip" />{{ lesson.attachmentsCount }}</span
            >
            <span class="ml-1 has-text-weight-semibold"
              ><b-icon icon="ruler" />{{ lesson.tasksCount }}</span
            >
            <span class="ml-1 has-text-weight-semibold"
              ><b-icon icon="comment-dots" />{{ lesson.commentsCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LessonContract } from "@/rpc/contracts/lesson";

@Component
export default class LessonCard extends Vue {
  @Prop(Object) public lesson!: LessonContract;
  @Prop(Number) public idx!: number;

  public isNew(createdAt: string): number {
    const diff = Math.floor((new Date() - Date.parse(createdAt)) / 86400000);
    return diff <= 7;
  }
}
</script>
<style lang="scss" scoped>
.is-disabled {
  background: rgba(255, 255, 255, 0.7);
  cursor: not-allowed;
}
.is-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
