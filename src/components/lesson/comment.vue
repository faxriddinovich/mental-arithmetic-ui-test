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
            <small class="ml-1">{{ comment.createdAt }}</small>
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
            v-else-if="canReply"
            >Reply</b-button
          >
        </div>
      </nav>
    </div>
    <div class="media-right" v-if="canDelete">
      <b-icon
        icon="trash-alt"
        class="is-clickable"
        @click.native="emitDelete"
      />
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Base } from "@/mixins/base.mixin";
import { CommentContract } from "@/rpc/contracts/lesson";

@Component
export default class Comment extends Mixins(Base) {
  @Prop(Object) public comment!: CommentContract;

  public get isLoading() {
    return !this.comment;
  }

  public get canDelete() {
    const { session, comment, isLoading } = this;
    return (
      session &&
      !isLoading &&
      (session.role === "root" || comment.creator.id === session.id)
    );
  }

  public get canReply() {
    const { session, comment } = this;
    return session && comment.creator.id !== session.id;
  }

  public emitReply() {
    this.$emit("reply", this.comment.creator.username);
  }

  public emitDelete() {
    this.$emit("delete", this.comment.id);
  }
}
</script>
