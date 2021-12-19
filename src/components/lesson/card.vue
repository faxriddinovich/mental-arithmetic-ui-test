<template>
  <router-link
    :to="{ name: 'Lesson', params: { id: lesson.id } }"
    :is="canClick ? 'router-link' : 'span'"
  >
    <div :class="cardClasses">
      <span class="is-size-6">
        <span class="has-text-weight-bold" v-if="index">{{ index }}. </span>
        <span class="has-text-weight-semibold">{{ lesson.title }} </span>
      </span>
      <hr class="mt-1 mb-1" />
      <div>
        <span class="has-text-weight-semibold"
          ><b-icon icon="paperclip" />{{ lesson.attachmentsCount }}</span
        >
        <span class="ml-1 has-text-weight-semibold"
          ><b-icon icon="ruler" />{{ lesson.tasksCount }}</span
        >
        <span class="ml-1 has-text-weight-semibold"
          ><b-icon icon="comment-dots" />{{ lesson.commentsCount }}</span
        >
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
            v-if="isNewLesson(lesson.createdAt)"
            >NEW</b-tag
          >
        </span>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "@vue/composition-api";
import { LessonContract } from "@/services/rpc/contracts/lesson";

export default defineComponent({
  props: {
    lesson: {
      type: Object as PropType<LessonContract>,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
    canClick: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  setup(props) {
    const cardClasses = computed(() => {
      const classes: string[] = ["card", "p-3", "is-bordered-bottom-accent"];
      if (!props.canClick) classes.push("is-disabled");

      return classes;
    });

    function isNewLesson(creationDate: string) {
      return (
        Math.floor(
          (new Date().getTime() - Date.parse(creationDate)) / 86400000
        ) >= 7
      );
    }

    return { cardClasses, isNewLesson };
  },
});
</script>
<style lang="scss" scoped>
.is-disabled {
  background: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}
</style>
