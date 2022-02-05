<template>
  <section class="hero is-fullheight">
    <div class="hero-body is-justify-content-center p-0">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-10-tablet is-7-desktop is-6-fullhd">
          <div class="mx-2">
            <div
              class="box m-0 is-bordered"
              style="
                width: 94%;
                margin: 0 auto -30px !important;
                background: rgb(241, 241, 241);
              "
            ></div>

            <div
              class="box m-0 is-bordered"
              style="
                width: 97%;
                margin: 0 auto -30px !important;
                background: rgb(247, 247, 247);
              "
            ></div>

            <div class="card p-1 is-bordered">
              <img :class="trophyClasses" :src="require('@@/img/trophy.png')" />
              <div class="p-4">
                <div :class="gameScoresTextClasses">
                  You {{ wonTheGame ? "won" : "lost" }}!
                </div>

                <b-progress
                  size="is-medium"
                  :type="wonTheGame ? 'is-success' : 'is-danger'"
                  :value="completedRowsPercent"
                  format="percent"
                  show-value
                >
                </b-progress>
                <nav class="level is-mobile">
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Completed rows</p>
                      <p class="title">
                        {{ completedRowsCount }}
                      </p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Spent time</p>
                      <p class="title">
                        {{ (timerSecs - timerAbsolute) | timerFormat }}
                      </p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                      <p class="heading">Total time</p>
                      <p class="title">
                        {{ timerSecs | timerFormat }}
                      </p>
                    </div>
                  </div>
                </nav>
                <span class="is-dotted">
                  <span class="is-left is-size-5-tablet mr-3"
                    >Total examples:</span
                  >
                  <span class="is-dots"></span>
                  <span
                    class="
                      is-right is-size-5-mobile is-size-4-tablet
                      has-text-weight-bold
                      ml-2
                    "
                    >{{ totalExamplesCount }}</span
                  >
                </span>

                <span class="is-dotted">
                  <span class="is-left is-size-5-tablet mr-3">Total rows:</span>
                  <span class="is-dots"></span>
                  <span
                    class="
                      is-right is-size-5-mobile is-size-4-tablet
                      has-text-weight-bold
                      ml-2
                    "
                    >{{ totalRowsCount }}</span
                  >
                </span>

                <hr />
                <div class="is-flex">
                  <b-button
                    tag="router-link"
                    :to="{ name: 'AbacusGameForm' }"
                    icon-left="arrow-left"
                    expanded
                    active
                    >Back</b-button
                  >
                  <b-button
                    class="ml-2"
                    icon-left="refresh"
                    @click="onRepeat"
                    expanded
                    active
                    >Repeat</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    wonTheGame: { type: Boolean, required: true },
    completedRowsPercent: { type: Number, required: true },
    completedRowsCount: { type: Number, required: true },
    totalExamplesCount: { type: Number, required: true },
    totalRowsCount: { type: Number, required: true },
    trophyClasses: { type: Array, required: true },
    gameScoresTextClasses: { type: Array, required: true },
    timerSecs: { type: Number, required: true },
    timerAbsolute: { type: Number, required: true },
    onRepeat: { type: Function, required: true }
  },
});
</script>
