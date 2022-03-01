<template>
  <div class="container is-max-widescreen">
    <div class="mx-2 pt-2">
      <b-tabs
        type="is-toggle"
        class="is-lesson-tabs"
        :animated="false"
        @input="changeTab"
        expanded
      >
        <!-- Lesson -->
        <b-tab-item value="lesson">
          <template #header>
            <b-icon icon="file-blank" class="mx-0" />
            <span class="is-hidden-mobile">Lesson</span>
          </template>

          <div>
            <b-skeleton width="200px" v-if="lessonLoading" />
            <div class="is-size-5 has-text-weight-semibold is-clickable" @click="copyLessonLink" v-else>
              {{ lesson.title }} <b-icon icon="clipboard-alt" />
            </div>
            <b-skeleton width="350px" v-if="lessonLoading" />
            <nav
              class="breadcrumb has-arrow-separator is-clipped"
              aria-label="breadcrumbs"
              v-else
            >
              <ul>
                <li>
                  <router-link :to="{ name: 'Home' }"
                    ><b-icon icon="home" />Home</router-link
                  >
                </li>
                <li>
                  <router-link
                    :to="{
                      name: 'Course',
                      params: { id: lesson.course.id },
                    }"
                    >{{ lesson.course.title }}</router-link
                  >
                </li>
                <li class="is-active">
                  <a href="#">{{ lesson.title }}</a>
                </li>
              </ul>
            </nav>
          </div>

          <div
            class="columns is-variable is-mobile is-multiline is-1 mt-2"
            v-if="lesson && lesson.attachments.length"
          >
            <div class="column is-12-touch is-8-desktop">
              <div class="card is-bordered is-overflow is-clipped">
                <div
                  v-for="(attachment, index) of lesson.attachments"
                  :key="index"
                >
                  <div v-if="pickedAttachmentIndex === index">
                    <div
                      class="is-flex is-justify-content-center p-2"
                      v-if="attachment.type === 'audio'"
                    >
                      <audio controls>
                        <source :src="fsBucketFactory(attachment.fguid)" />
                      </audio>
                    </div>
                    <div v-else-if="attachment.type === 'image'">
                      <b-image
                        :src="fsBucketFactory(attachment.fguid)"
                        ratio="4by3"
                      />
                    </div>
                    <div v-else-if="attachment.type === 'video'">
                      <video class="is-128x128" width="100%" controls>
                        <source :src="fsBucketFactory(attachment.fguid)" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div
                class="card is-bordered"
                style="max-height: 550px; overflow-y: scroll"
              >
                <div
                  v-for="(attachment, index) of lesson.attachments"
                  :class="attachmentClass(index)"
                  @click="pickedAttachmentIndex = index"
                  :key="index"
                >
                  <div>
                    <b-icon :icon="attachmentIcon(attachment.type)" />
                    {{ index + 1 }}. {{ attachment.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card mt-2 p-3 is-bordered" v-if="!lessonLoading">
            {{ lesson.body }}
          </div>
        </b-tab-item>
        <!-- End lesson -->

        <!-- Tasks -->
        <b-tab-item value="tasks">
          <template #header>
            <b-icon icon="ruler" class="mx-0" />
            <span class="is-hidden-mobile">Tasks:</span>
            <span class="icon is-small ml-1" v-if="lessonLoading">
              <b-skeleton></b-skeleton>
            </span>
            <span class="ml-1 has-text-weight-semibold" v-else>{{
              lesson.tasksCount
            }}</span>
          </template>

          <div class="card py-1 is-bordered">
            <div v-if="lessonLoading">
              <lesson-task />
              <lesson-task />
              <lesson-task />
            </div>
            <lesson-task
              v-for="(task, index) of tasks"
              :key="index"
              :task="task"
              :idx="++index"
              v-else
            />
          </div>
        </b-tab-item>
        <!-- End tasks -->

        <!-- Comments -->
        <b-tab-item value="comments">
          <template #header>
            <b-icon icon="comment-dots" class="mx-0" />
            <span class="is-hidden-mobile">Comments:</span>
            <span class="icon is-small ml-1" v-if="lessonLoading">
              <b-skeleton></b-skeleton>
            </span>
            <span class="ml-1 has-text-weight-semibold" v-else>{{
              lesson.commentsCount
            }}</span>
          </template>
          <div class="card p-4 is-bordered" v-if="activeSession">
            <form @submit.prevent="createComment">
              <b-field>
                <b-input
                  type="textarea"
                  minlength="1"
                  maxlength="400"
                  placeholder="Write something..."
                  :has-counter="false"
                  ref="commentTextarea"
                  v-model="commentText"
                  required
                ></b-input>
              </b-field>
              <div class="has-text-right">
                <b-button
                  native-type="submit"
                  type="is-success"
                  icon-left="pen"
                  :disabled="commentsLoading"
                  >Leave comment</b-button
                >
              </div>
            </form>
          </div>
          <div class="mt-3">
            <div class="card px-3 is-bordered" v-if="commentsLoading">
              <lesson-comment />
              <lesson-comment />
            </div>
            <div
              class="has-text-centered has-text-weight-bold"
              v-else-if="!comments.length"
            >
              There are no comments yet.
            </div>
            <div class="card px-3 is-bordered" v-else>
              <lesson-comment
                @reply="replyComment"
                @delete="deleteComment"
                v-for="comment of comments"
                :comment="comment"
                :key="comment.id"
              />
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
      <!-- End comments -->

      <div class="is-flex">
        <b-button icon-left="home" tag="router-link" to="/" expanded
          >Home</b-button
        >
        <b-button
          icon-left="arrow-left"
          class="ml-2"
          tag="router-link"
          :to="{
            name: 'Course',
            params: { id: lesson.course.id },
          }"
          expanded
          v-if="lesson"
          >Course</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import LessonCard from "@/components/lesson/card.vue";
import LessonTask from "@/components/lesson/task.vue";
import LessonComment from "@/components/lesson/comment.vue";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_LESSON_METHOD,
  RPC_GET_COMMENTS_METHOD,
  RPC_CREATE_COMMENT_METHOD,
  RPC_DELETE_COMMENT_METHOD,
} from "@/services/rpc/methods";
import {
  RPC_NOT_PURCHASED_ERR_CODE,
  RPC_ACCESS_DENIED_ERR_CODE,
} from "@/services/rpc/error-codes";
import { CommentContract } from "@/services/rpc/contracts/comment";
import { LessonContract } from "@/services/rpc/contracts/lesson";
import { SessionStorage, Session } from "@/services/storages/session";
import { fsBucketFactory } from "@/common/utils";
import { isNative } from "@/services/platform";
import { writeToClipboard } from "@/services/clipboard";

export default defineComponent({
  components: { LessonCard, LessonTask, LessonComment },
  setup(_, context) {
    const activeSession = ref<Session | null>(null);
    const lesson = ref<LessonContract | null>(null);
    const comments = ref<CommentContract[] | null>(null);
    const commentText = ref<string>("");
    const commentTextarea = ref();
    const pickedAttachmentIndex = ref<number>(0);

    const lessonLoading = ref<boolean>(true);
    const commentsLoading = ref<boolean>(true);

    function attachmentClass(index: number) {
      const classes: string[] = ["px-3 py-2 is-attachment-item"];

      if (pickedAttachmentIndex.value === index)
        classes.push("is-attachment-active-item has-text-weight-semibold");

      return classes;
    }

    const tasks = computed(() => {
      return [
        {
          image: "https://cdn-icons-png.flaticon.com/512/4100/4100738.png",
          title: "Abacus",
        },
        {
          image: "https://cdn-icons-png.flaticon.com/512/1519/1519458.png",
          title: "Numbers",
        },
        {
          image: "https://cdn-icons-png.flaticon.com/512/4768/4768698.png",
          title: "Flash card",
        },
        {
          image: "https://cdn-icons-png.flaticon.com/512/1994/1994825.png",
          title: "Table",
        },
        {
          image: "https://cdn-icons-png.flaticon.com/512/1156/1156977.png",
          title: "Test",
        },
      ];
    });

    function getActiveSession() {
      SessionStorage.getActiveSession().then((session) => {
        activeSession.value = session;
      });
    }

    const routeParams = context.root.$route.params;

    function getLesson() {
      rpc
        .call(RPC_GET_LESSON_METHOD, { lessonId: Number(routeParams.id) })
        .then((result) => {
          lesson.value = result;
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_NOT_PURCHASED_ERR_CODE) {
              showToastMessage(
                "The course was not purchased",
                ToastType.Danger
              );
              context.root.$router.push({ name: "Home" });
            } else if (jsonrpcError.code === RPC_ACCESS_DENIED_ERR_CODE) {
              showToastMessage(
                "You don't have access to see the lesson",
                ToastType.Danger
              );
              context.root.$router.push({ name: "Authenticate" });
            }
          }
        })
        .finally(() => {
          lessonLoading.value = false;
        });
    }

    function getComments() {
      commentsLoading.value = true;
      comments.value = null;
      rpc
        .call(RPC_GET_COMMENTS_METHOD, { lessonId: Number(routeParams.id) })
        .then((result) => {
          comments.value = result;
        })
        .finally(() => {
          commentsLoading.value = false;
        });
    }

    function createComment() {
      rpc
        .call(RPC_CREATE_COMMENT_METHOD, {
          lessonId: Number(routeParams.id),
          body: commentText.value,
        })
        .then(() => {
          getComments();
          commentText.value = "";
        })
        .catch(() => {
          showToastMessage("Unable to leave a comment", ToastType.Danger);
        });
    }

    function replyComment(to: string) {
      commentTextarea.value.focus();
      commentText.value = `@${to}, ${commentText.value}`;
      window.scrollTo(0, 0);
    }

    function deleteComment(commentId: number) {
      rpc.call(RPC_DELETE_COMMENT_METHOD, { commentId }).then(() => {
        getComments();
      });
    }

    function changeTab(tab: string) {
      if (tab === "comments") getComments();
    }

    // TODO: can we optimize this function ?
    function attachmentIcon(type: string) {
      if (type === "image") return "image";
      if (type === "video") return "play";
      return "volume";
    }

    async function copyLessonLink() {
      const currentPath = context.root.$route.path;
      const url = isNative()
        ? process.env.VUE_APP_PROTOCOL + ':/' + currentPath
        : "http://production-ui.url" + currentPath; // FIXME
      await writeToClipboard({ url });
      showToastMessage("Copied to clipboard", ToastType.Success);
    }

    onMounted(() => {
      getActiveSession();
      getLesson();
    });

    return {
      activeSession,
      lesson,
      tasks,
      comments,
      commentText,
      commentTextarea,
      changeTab,
      attachmentIcon,
      copyLessonLink,
      pickedAttachmentIndex,
      attachmentClass,
      lessonLoading,
      commentsLoading,
      createComment,
      deleteComment,
      replyComment,
      fsBucketFactory,
    };
  },
});
</script>

<style lang="scss">
$border-color: rgb(149, 165, 166);

.is-lesson-tabs > .tabs {
  background: white;
  padding: 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid $border-color;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0px 0 1px rgba(10, 10, 10, 0.02);
}

.is-lesson-tabs > .tab-content {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.is-lesson-tabs.b-tabs {
  margin-bottom: 0px !important;
}

.is-bordered {
  border: 1px solid $border-color;
}

.is-attachment-item {
  cursor: pointer;
}

.is-attachment-active-item {
  background: rgba(0, 0, 0, 0.03);
  cursor: auto;
}

.is-attachment-item:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
