<template>
  <div>
    <!-- controls bar -->
    <section class="card is-border-radiusless" v-if="displayMode !== 'scores'">
      <div class="p-2">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <b-button
            tag="router-link"
            :to="{ name: 'AbacusGameForm' }"
            size="is-medium"
            active
            ><b-icon icon="arrow-left" class="m-0" /><span
              class="is-hidden-mobile"
              >{{ $t("back") }}</span
            ></b-button
          >
          <div class="is-flex is-align-items-center">
            <span v-if="timerEnabled">
              <span :class="timerClasses">
                <b-icon icon="stopwatch" size="is-medium" />
                {{ timerAbsolute | timerFormat }}
              </span>
            </span>
            <span v-else>
              <b-icon icon="abacus" size="is-large" type="is-primary" />
            </span>
          </div>

          <b-dropdown aria-role="list" class="is-hidden-tablet">
            <template #trigger>
              <b-button size="is-medium" active
                ><b-icon icon="bars" class="m-0"
              /></b-button>
            </template>

            <b-dropdown-item aria-role="listitem" @click="onReshowCurrentTheme"
              ><b-icon icon="redo" size="is-small" />{{
                $t("reshow_theme")
              }}</b-dropdown-item
            >
            <b-dropdown-item
              aria-role="listitem"
              @click="onReshowCurrentExample"
              ><b-icon icon="redo" size="is-small" />
              {{ $t("reshow_example") }}</b-dropdown-item
            >
            <hr class="dropdown-divider" aria-role="menuitem" />
            <b-dropdown-item aria-role="listitem" @click="onRestart"
              ><b-icon icon="sync-exclamation" size="is-small" />
              {{ $t("repeat") }}</b-dropdown-item
            >
          </b-dropdown>
          <b-button
            class="is-hidden-mobile"
            size="is-medium"
            active
            @click="onRestart"
            ><b-icon icon="redo" class="m-0" /><span class="is-hidden-mobile">{{
              $t("repeat")
            }}</span></b-button
          >
        </div>
      </div>
      <b-progress
        type="is-success"
        class="completed-progress"
        :value="completedExamplesPercent"
      />
    </section>
    <!-- end controls bar -->

    <!-- confetti screen -->
    <canvas class="abacus-game-confetti" ref="confettiRef" />

    <!-- abacus board -->
    <div v-show="canDisplayAbacus" class="is-abacus-board-container">
      <div ref="abacusContainerRef" />
    </div>

    <div class="is-flex is-justify-content-center mt-4" v-if="canDisplayCards">
      <div class="abacus-game-card-container">
        <div :class="cardClasses">
          <div
            class="
              is-size-1
              is-flex
              is-justify-content-center
              is-align-items-center
              is-full-size
              has-text-centered
            "
            v-if="displayMode == 'attention-card'"
          >
            <span>{{ currentCard.text }}</span>
          </div>
          <svg
            class="is-full-size"
            viewBox="0 0 484 230"
            v-else-if="
              currentThemeOperation & Operation.mult ||
              currentThemeOperation & Operation.div
            "
          >
            <text
              fill="#fff"
              x="0"
              y="115"
              dominant-baseline="middle"
              text-anchor="start"
              font-size="80px"
              opacity=".9"
            >
              {{ currentCard.operation & Operation.mult ? "×" : "÷" }}
            </text>
            <text
              fill="#fff"
              x="484"
              y="20"
              font-size="90px"
              text-anchor="end"
              dominant-baseline="hanging"
            >
              {{ currentCard.row[0] }}
            </text>
            <line
              x1="80"
              y1="115"
              x2="484"
              y2="115"
              stroke="white"
              stroke-width="6"
              stroke-opacity=".9"
            />
            <text
              fill="#fff"
              x="484"
              y="200"
              font-size="90px"
              text-anchor="end"
              dominant-baseline="auto"
            >
              {{ currentCard.row[1] }}
            </text>
          </svg>
          <div
            class="
              is-flex
              is-full-size
              is-align-items-center
              is-justify-content-center
            "
            v-else-if="currentCard.speechOnly"
          >
            <b-icon icon="volume" size="is-large" />
          </div>
          <svg viewBox="0 0 150 65" class="is-full-size" v-else>
            <transition name="fade-animation" mode="in-out">
              <text
                dominant-baseline="central"
                text-anchor="middle"
                font-size="65px"
                x="50%"
                y="50%"
                fill="#fff"
                :key="'row' + currentRow"
              >
                {{ currentCard.row }}
              </text>
            </transition>
          </svg>
        </div>
      </div>
    </div>

    <div
      class="buttons is-centered is-hidden-mobile mt-4"
      v-if="canDisplayButtons"
    >
      <b-button icon-left="redo" @click="onReshowCurrentTheme">{{
        $t("reshow_theme")
      }}</b-button>
      <b-button icon-left="align-left-justify" @click="onShowAnswer">{{
        $t("show_answer")
      }}</b-button>
      <b-button icon-left="redo" @click="onReshowCurrentExample">{{
        $t("reshow_example")
      }}</b-button>
      <b-button icon-right="arrow-right" @click="onShowNextTheme"
        >Keyingi mavzu</b-button
      >
    </div>

    <!-- answer display -->
    <section class="hero is-fullheight" v-if="canDisplayAnswer">
      <div class="hero-body is-justify-content-center p-0">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div class="column is-5-fullhd is-three-quarters-desktop">
            <div class="box mx-2">
              <div class="is-size-3 has-text-weight-semibold has-text-centered">
                <span
                  v-for="(row, rowIndex) of currentExample.numbers"
                  :key="rowIndex"
                >
                  {{ row | normalizeSign }}&nbsp;
                </span>
                <div class="has-text-centered">
                  <span class="has-text-success has-text-weight-bold is-size-2"
                    >= {{ currentExample.answer }}</span
                  >
                </div>
              </div>

              <hr class="my-4" />
              <div class="field is-grouped is-grouped-multiline">
                <div
                  class="control"
                  v-for="(row, rowIndex) in currentExample.numbers.length - 1"
                  :key="rowIndex"
                >
                  <div class="tags has-addons">
                    <span class="tag is-medium"
                      ><span class="has-text-weight-bold"
                        >{{ currentExample.answerMap[rowIndex] }}&nbsp;</span
                      >
                      {{ currentExample.numbers[rowIndex + 1] | normalizeSign }}
                      =
                    </span>
                    <span class="tag is-primary is-medium">{{
                      currentExample.answerMap[rowIndex + 1]
                    }}</span>
                  </div>
                </div>
              </div>

              <hr class="mt-0 mb-2" />
              <div class="is-flex">
                <b-button
                  icon-left="redo"
                  @click="onReshowCurrentExample"
                  expanded
                  >{{ $t("reshow_example") }}</b-button
                >
                <b-button
                  icon-right="arrow-right"
                  class="ml-3"
                  @click="onNextExample"
                  expanded
                  >{{ $t("next_example") }}</b-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end answer display -->

    <!-- scores display -->
    <section class="hero is-fullheight" v-else-if="displayMode === 'scores'">
      <div class="hero-body is-justify-content-center p-0">
        <div class="columns is-gapless is-centered" style="min-width: 100%">
          <div class="column is-10-tablet is-7-desktop is-6-fullhd">
            <div class="mx-2">
              <stacked-cards :count="2">
                <img
                  :class="trophyClasses"
                  :src="require('@@/img/trophy.png')"
                />
                <div class="p-4">
                  <div :class="gameScoresTextClasses">
                    {{ wonTheGame ? $t("you_won") : $t("you_lost") }}
                  </div>

                  <b-progress
                    size="is-medium"
                    :type="wonTheGame ? 'is-success' : 'is-danger'"
                    :value="completedExamplesPercent"
                    format="percent"
                    show-value
                  >
                  </b-progress>
                  <nav class="level is-mobile">
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">{{ $t("completed_examples") }}</p>
                        <p class="title">
                          {{ completedExamplesCount }}
                        </p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">{{ $t("spent_time") }}</p>
                        <p class="title">
                          {{ (config.timerSecs - timerAbsolute) | timerFormat }}
                        </p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">{{ $t("total_time") }}</p>
                        <p class="title">
                          {{ config.timerSecs | timerFormat }}
                        </p>
                      </div>
                    </div>
                  </nav>
                  <span class="is-dotted">
                    <span class="is-left is-size-5-tablet mr-3"
                      >{{ $t("total_examples") }}:</span
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
                    <span class="is-left is-size-5-tablet mr-3"
                      >{{ $t("total_rows") }}:</span
                    >
                    <span class="is-dots"></span>
                    <span
                      class="
                        is-right is-size-5-mobile is-size-4-tablet
                        has-text-weight-bold
                        ml-2
                      "
                      >STATIC</span
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
                      >{{ $t("back") }}</b-button
                    >
                    <b-button
                      class="ml-2"
                      icon-left="refresh"
                      @click="onRestart"
                      expanded
                      active
                      >{{ $t("repeat") }}</b-button
                    >
                  </div>
                </div>
              </stacked-cards>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end scores display -->
  </div>
</template>
<script lang="ts" src="./game.ts"></script>
<style lang="scss">
@import "bulma/sass/utilities/mixins";

$small: 376px;
$extra-small: 321px;

/* unused, but looks cool */
.abacus-game-card-container {
  padding: 10px;
  position: relative;
  width: 30%;
  height: 270px !important;
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.05),
    inset -5px -5px 5px rgba(255, 255, 255, 0.5),
    5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5);

  @include until($small) {
    height: 200px !important;
  }

  @include mobile {
    width: 96% !important;
  }

  @include tablet {
    width: 40% !important;
    height: 200px !important;
  }

  @include desktop {
    width: 35% !important;
    height: 240px !important;
  }

  @include fullhd {
    width: 35% !important;
    height: 260px !important;
  }
}

.abacus-game-card {
  color: white;
  border-radius: 5px;
  padding: 10px;
  height: 100%;
}

.is-abacus-board-container {
  width: 100%;
  position: absolute;
  overflow-x: scroll;
  overflow-y: hidden;
  bottom: 0;
}

svg.is-abacus-board {
  display: block;
  margin: auto;
  height: 569px !important;

  @include mobile {
    height: 350px !important;
  }

  @include until($extra-small) {
    height: 250px !important;
  }

  @include tablet {
    height: 390px !important;
  }

  @include desktop {
    height: 390px !important;
  }

  @include widescreen {
    height: 500px !important;
  }
}

.fade-animation-enter-active {
  opacity: 0;
}

.fade-animation-leave-active {
  opacity: 1;
}

/*
.fade-animation-enter, .fade-animation-leave-to {
  opacity: 0;
}
*/

img.abacus-game-trophy {
  display: block;
  width: 170px;
  margin-top: -100px;
  margin-left: auto;
  margin-right: auto;

  @include mobile {
    width: 160px;
    margin-top: -80px;
  }
}

.abacus-game-trophy.is-lost {
  filter: grayscale(1);
}

canvas.abacus-game-confetti {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999;
}
</style>
