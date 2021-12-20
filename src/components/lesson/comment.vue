<template>
  <article class="media my-2 py-2">
    <figure class="media-left">
      <p class="image is-64x64">
        <b-skeleton height="64px" v-if="!comment" circle />
        <b-image
          class="is-64x64"
          :src="avatarFactory(comment.creator.username)"
          rounded
          v-else
        />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <b-skeleton width="200px" v-if="!comment" />
        <span v-else>
          <strong :class="comment.creator.isBlocked && 'is-blocked'">{{
            comment.creator.username
          }}</strong>
          <b-icon
            icon="check-circle"
            class="ml-1"
            type="is-info"
            v-if="comment.creator.role === 'root'"
          />
          <span class="ml-2">
            <b-icon icon="calendar-alt" size="is-small" />
            <small class="ml-1">{{ comment.createdAt }}</small>
          </span>
        </span>

        <b-skeleton :count="3" v-if="!comment" />
        <div v-else>
          {{ comment.body }}
        </div>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <b-skeleton width="80px" v-if="!comment" />

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
      <button class="delete" @click="emitDelete" />
    </div>
  </article>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  onMounted,
  ref,
  computed,
} from "@vue/composition-api";
import { CommentContract } from "@/services/rpc/contracts/comment";
import { SessionStorage, Session } from "@/services/storages/session";
import { avatarFactory } from "@/common/utils";

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<CommentContract>,
      reqiured: false,
    },
  },
  setup(props, context) {
    const activeSession = ref<Session | null>(null);

    const canDelete = computed(() => {
      const role = activeSession.value?.role;
      const isCreator = props.comment?.creator.id === activeSession.value?.id;
      return (
        (activeSession.value &&
          props.comment &&
          activeSession.value &&
          role == "root") ||
        isCreator
      );
    });

    const canReply = computed(() => {
      const activeSessionId = activeSession.value?.id;
      return (
        activeSession.value && props.comment?.creator.id !== activeSessionId
      );
    });

    function getActiveSession() {
      SessionStorage.getActiveSession().then((session) => {
        activeSession.value = session;
      });
    }

    function emitDelete() {
      context.emit("delete", props.comment!.id);
    }

    function emitReply() {
      context.emit("reply", props.comment!.creator.username);
    }

    onMounted(() => {
      getActiveSession();
    });

    return { avatarFactory, canDelete, canReply, emitDelete, emitReply };
  },
});
</script>
