<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-64x64">
        <b-skeleton height="64px" v-if="isLoading" />
        <img src="https://bulma.io/images/placeholders/128x128.png" v-else />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <b-skeleton width="200px" v-if="isLoading" />
        <span v-else>
          <strong>{{ comment.creator.username }}</strong>
          <span class="ml-2">
            <b-icon icon="calendar-alt" size="is-small" />
            <small class="ml-1">2027.01.01 00:00:01</small>
          </span>
        </span>

        <b-skeleton :count="3" v-if="isLoading" />
        <div v-else>
          {{ comment.body }}
        </div>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <b-skeleton width="80px" v-if="isLoading" />

          <b-button
            icon-left="corner-up-left"
            class="has-text-weight-semibold"
            size="is-small"
            @click="emitReply"
            v-else
            >Reply</b-button
          >
        </div>
      </nav>
    </div>
    <div class="media-right">
      <b-icon icon="trash-alt" />
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Comment extends Vue {
  @Prop(Object) public comment;

  public get isLoading() {
    return !this.comment;
  }

  public emitReply() {
    this.$emit("reply", this.comment.creator.username);
  }
}
</script>
