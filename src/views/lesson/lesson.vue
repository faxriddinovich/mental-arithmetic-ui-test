<template>
  <div class="container">
    <div class="mx-2 pt-2">
      <div class="columns">
        <div class="column is-8-desktop">
          <b-tabs
            type="is-toggle"
            class="is-lesson-tabs"
            :animated="false"
            expanded
          >
            <!-- Lesson -->
            <b-tab-item>
              <template #header>
                <b-icon icon="file-blank" class="mx-0" />
                <span class="is-hidden-mobile">Lesson</span>
              </template>

              <div>
                <div class="is-size-5 has-text-weight-semibold">
                  Marketing in 5 minutes
                </div>
                <nav
                  class="breadcrumb has-arrow-separator"
                  aria-label="breadcrumbs"
                >
                  <ul>
                    <li>
                      <router-link to="/"
                        ><b-icon icon="home" />Home</router-link
                      >
                    </li>
                    <li><a href="#">Marketing in 5 mins!</a></li>
                    <li class="is-active">
                      <a href="#">Digital marketing Demystified in 5 Mins!</a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div class="is-bordered card mt-4 is-overflow is-clipped">
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
                  <div class="is-size-5 has-text-weight-semibold">
                    What Is Marketing?
                  </div>
                  Marketing refers to activities a company undertakes to promote
                  the buying or selling of a product or service. Marketing
                  includes advertising, selling, and delivering products to
                  consumers or other businesses. Some marketing is done by
                  affiliates on behalf of a company. Professionals who work in a
                  corporation's marketing and promotion departments seek to get
                  the attention of key potential audiences through advertising.
                  Promotions are targeted to certain audiences and may involve
                  celebrity endorsements, catchy phrases or slogans, memorable
                  packaging or graphic designs and overall media exposure.
                  <div class="is-size-5 has-text-weight-semibold mt-3">
                    Understanding marketing
                  </div>
                  Marketing as a discipline involves all the actions a company
                  undertakes to draw in customers and maintain relationships
                  with them. Networking with potential or past clients is part
                  of the work too, and may include writing thank you emails,
                  playing golf with prospective clients, returning calls and
                  emails quickly, and meeting with clients for coffee or a meal.
                  At its most basic level, marketing seeks to match a company's
                  products and services to customers who want access to those
                  products. Matching products to customers ultimately ensures
                  profitability.
                </div>
                <div class="is-flex is-justify-content-space-between mt-4">
                  <span class="is-size-7"
                    ><b-icon icon="user" size="is-small" /> mhw0</span
                  >
                  <span class="is-size-7"
                    ><b-icon icon="calendar-alt" size="is-small" /> 2021-02-02
                    10:41:24</span
                  >
                </div>
              </div>
            </b-tab-item>
            <!-- End lesson -->

            <!-- Tasks -->
            <b-tab-item>
              <template #header>
                <b-icon icon="ruler" class="mx-0" />
                <span class="is-hidden-mobile">Tasks</span>
              </template>

              <div class="card p-3 is-bordered">
                <div
                  v-for="(task, index) of tasks"
                  :key="index"
                  class="
                    mb-2
                    is-flex
                    is-justify-content-space-between
                    is-align-items-center
                  "
                >
                  <div class="is-flex is-align-items-center">
                    <img :src="task.image" width="40" />
                    <div class="ml-2">
                      <div class="has-text-weight-semibold">
                        {{ ++index }}. {{ task.title }}
                      </div>
                      <div>Some description here</div>
                    </div>
                  </div>
                  <div>
                    <b-button icon-right="arrow-right" size="is-small"
                      >Perform</b-button
                    >
                  </div>
                </div>
              </div>
            </b-tab-item>
            <!-- End tasks -->
            <!-- Comments -->

            <b-tab-item>
              <template #header>
                <b-icon icon="comment-dots" class="mx-0" />
                <span class="is-hidden-mobile">Comments</span>
              </template>
              <div class="card p-2">comments</div>
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
        <div class="column is-4-desktop">
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

@Component({ components: { LessonCard } })
export default class Lesson extends Vue {
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
}
</script>
<style lang="scss">
$border-color: rgb(149, 165, 166);

.is-task {
}

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
