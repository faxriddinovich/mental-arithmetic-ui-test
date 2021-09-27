<template>
  <div class="container">
    <div class="mx-2 pt-2">
      <div class="columns is-desktop">
        <div class="column is-12-tablet is-8-desktop">
          <b-tabs
            type="is-toggle"
            class="is-lesson-tabs"
            :animated="false"
            @input="tabChange"
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
                <div class="is-size-5 has-text-weight-semibold" v-else>
                  {{ lesson.title }}
                </div>
                <b-skeleton width="350px" v-if="lessonLoading" />
                <nav
                  class="breadcrumb has-arrow-separator"
                  aria-label="breadcrumbs"
                  v-else
                >
                  <ul>
                    <li>
                      <router-link to="/"
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
                class="is-bordered card mt-4 is-overflow is-clipped"
                v-if="!lessonLoading"
              >
                <div>
                  <video width="100%" controls>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
                  </video>
                </div>
                <div>
                  <div
                    class="
                      px-3
                      py-2
                      is-playlist-active-item
                      has-text-weight-semibold
                    "
                  >
                    <b-icon icon="play" /> 1. Digital Marketing Demystified in 5
                    Mins!
                  </div>
                  <div class="px-3 py-2 is-playlist-item">
                    <b-icon icon="play" /> 2. How to Find a Hungry-to-Buy
                    Audience with 3 Simple Questions
                  </div>
                  <div class="px-3 py-2 is-playlist-item">
                    <b-icon icon="play" /> 3. How to Find a Hungry-to-Buy
                    Audience with 3 Simple Questions
                  </div>
                  <div class="px-3 py-2 is-playlist-item">
                    <b-icon icon="volume" /> 4. How to Find a Hungry-to-Buy
                    Audience with 3 Simple Questions
                  </div>
                </div>
              </div>

              <div class="card mt-4 p-3 is-bordered">
                <div>
                  <b-skeleton :count="4" v-if="lessonLoading" />
                  <div v-else>
                    {{ lesson.body }}
                  </div>
                </div>
                <div class="is-flex is-justify-content-space-between mt-4">
                  <b-skeleton width="100px" v-if="lessonLoading" />
                  <span class="is-size-7" v-else
                    ><b-icon icon="user" size="is-small" />{{
                      lesson.author.username
                    }}</span
                  >

                  <b-skeleton
                    width="100px"
                    position="is-right"
                    v-if="lessonLoading"
                  />
                  <span class="is-size-7" v-else-if="lesson.createdAt"
                    ><b-icon icon="calendar-alt" size="is-small" /> 2021-02-02
                    10:41:24</span
                  >
                </div>
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
                  lesson.tasks
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
                  lesson.comments
                }}</span>
              </template>
              <div class="card p-4 is-bordered">
                <form @submit.prevent="createComment">
                  <b-field>
                    <b-input
                      type="textarea"
                      minlength="1"
                      maxlength="400"
                      placeholder="Write something..."
                      :has-counter="false"
                      ref="commentTextare"
                      v-model="comment"
                      required
                    ></b-input>
                  </b-field>
                  <div class="has-text-right">
                    <b-button
                      native-type="submit"
                      type="is-success"
                      icon-left="pen"
                      >Leave comment</b-button
                    >
                  </div>
                </form>
              </div>
              <div class="mt-3">
                <div class="card p-3 is-bordered" v-if="commentsLoading">
                  <lesson-comment />
                  <lesson-comment />
                </div>
                <div
                  class="has-text-centered has-text-weight-bold"
                  v-else-if="!comments.length"
                >
                  There are no comments yet.
                </div>
                <div class="card p-3 is-bordered" v-else>
                  <lesson-comment
                    @reply="reply"
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
              to="/"
              expanded
              >Course</b-button
            >
          </div>
        </div>
        <div class="column is-12-tablet is-4-desktop">
          <lesson-card
            :lesson="{ id: 2, title: 'test', comments: 2, tasks: 4 }"
            :idx="1"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import LessonCard from "@/components/lesson/card.vue";
import LessonTask from "@/components/lesson/task.vue";
import LessonComment from "@/components/lesson/comment.vue";
import { rpc } from "@/rpc/rpc";
import {
  RPC_GET_LESSON_METHOD,
  RPC_GET_COMMENTS_METHOD,
  RPC_CREATE_COMMENT_METHOD,
} from "@/rpc/methods";

@Component({ components: { LessonCard, LessonTask, LessonComment } })
export default class Lesson extends Vue {
  public lesson = null;
  public comments = null;

  public comment = "";

  public get lessonLoading() {
    return this.lesson === null;
  }

  public get commentsLoading() {
    return this.comments === null;
  }

  public tasks = [
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

  mounted() {
    const lessonId = Number(this.$route.params.id);
    rpc.call(RPC_GET_LESSON_METHOD, { lessonId }).then((lesson) => {
      this.lesson = lesson;
    });
  }

  public tabChange(tab) {
    if (tab === "comments") {
      this.loadComments();
      return;
    }
  }

  public loadComments() {
    this.comments = null;
    const lessonId = Number(this.$route.params.id);
    rpc.call(RPC_GET_COMMENTS_METHOD, { lessonId }).then((comments) => {
      this.comments = comments;
    });
  }

  public reply(to: string) {
    this.$refs.commentTextare.focus();
    this.comment = `@${to}, ${this.comment}`;
    window.scrollTo(0, 0);
  }

  public createComment() {
    const lessonId = Number(this.$route.params.id);
    rpc
      .call(RPC_CREATE_COMMENT_METHOD, { lessonId, body: this.comment })
      .then(() => {
        this.loadComments();
      })
      .catch(() => {
        this.$buefy.toast.open({
          type: "is-danger",
          position: "is-top",
          message: "Unable to leave a comment",
        });
      });
  }
}
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

.is-playlist-item {
  cursor: pointer;
}

.is-playlist-active-item {
  background: rgba(0, 0, 0, 0.03);
  cursor: auto;
}

.is-playlist-item:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
