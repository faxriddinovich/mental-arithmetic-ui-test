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
          <div class="card p-1 mt-4">
            <div class="is-size-4">2</div>
            <video width="100%" controls>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
            </video>
          </div>
          <div class="card p-4 mt-3">
            <!--
          <video width="100%" controls>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" />
          </video>
          --></div>
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
