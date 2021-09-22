<template>
  <div class="container">
    <div class="mx-2 pt-2">
      <div class="columns">
        <div class="column is-8-desktop">
          <div class="card p-2">
            <div class="tabs is-toggle is-fullwidth">
              <ul>
                <li class="is-active">
                  <a> <b-icon icon="file-blank" />Lesson </a>
                </li>
                <li>
                  <a>
                    <b-icon icon="ruler" />Tasks:
                    <span class="has-text-weight-semibold ml-1">0</span>
                  </a>
                </li>
                <li>
                  <a>
                    <b-icon icon="comment-dots" />Comments<span
                      class="has-text-weight-semibold ml-1"
                      >0</span
                    >
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mt-3">
            <div class="is-size-5 has-text-weight-semibold">Marketing in 5 minutes</div>
						<nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
							<ul>
								<li><a href="#"><b-icon icon="home"/>Home</a></li>
								<li><a href="#">Marketing in 5 mins!</a></li>
								<li class="is-active"><a href="#">Digital marketing Demystified in 5 Mins!</a></li>
							</ul>
						</nav>
          </div>
          <div class="is-player card mt-4 is-overflow is-clipped">
            <div>
              <video width="100%" controls>
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
              </video>
            </div>
            <div>
              <div class="px-3 py-2 is-playlist-active-item has-text-weight-semibold">
                <b-icon icon="play" /> 1. Digital Marketing Demystified in 5 Mins!
              </div>
              <div class="px-3 py-2 is-playlist-item">
                <b-icon icon="file" /> 2. How to Find a Hungry-to-Buy Audience with 3 Simple Questions
              </div>
            </div>
          </div>
          <div class="card mt-4 p-3 is-player">
						<div class="has-text-right">
							<b-icon icon="calendar-alt" /> 2021-02-02 10:41:24
						</div>
            2
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
export default class Lesson extends Vue {}
</script>
<style lang="scss">
.is-player {
  border: 1px solid rgb(149, 165, 166)
}

.is-playlist-item {
  cursor: pointer;
}

.is-playlist-active-item {
  background: rgba(0, 0, 0, .03);
  cursor: auto;
}

.is-playlist-item:hover {
  background: rgba(0, 0, 0, .03);
}
</style>
