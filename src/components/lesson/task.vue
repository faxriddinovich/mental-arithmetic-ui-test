<template>
  <article :class="{ 'is-task': !isLoading,  media: true , 'py-1': true, 'px-4': true,  'm-0': true }">
    <figure class="media-left">
      <p class="image is-40x40">
        <b-skeleton height="40px" v-if="isLoading" />
        <img :src="task.image" v-else />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <div v-if="isLoading">
          <b-skeleton width="150px" />
          <b-skeleton width="300px" />
        </div>
<div v-else>
        <div class="has-text-weight-semibold">
          {{ idx }}. {{ task.title }}
        </div>
Some description about the task
</div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Task extends Vue {
  // FIXME: TaskContract
  @Prop(Object) public task!: any;
  @Prop(Number) public idx!: number;

  public get isLoading() {
    return !this.task;
  }
}
</script>
<style lang="scss" scoped>
.is-task {
  cursor: pointer;
}

.is-task:hover {
  background: rgba(0, 0, 0, 0.03);
}
</script>
