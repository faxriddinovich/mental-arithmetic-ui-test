<template>
  <div>
    <div
      class="
        columns
        is-marginless is-mobile is-multiline is-centered is-vcentered
      "
      style="height: 100vh"
    >
      <div
        :class="columnClasses"
        v-for="(player, index) of [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="index"
      >
        <BigNumbersGame
          :multiplayerMode="true"
          :answerAtEnd="true"
          :topBar="false"
          :onQueueFinish="incrementWaitingInstances"
          :queue="[
            {
              theme: 'theme1',
              examples: [{ numbers: ['1', '324'], answer: 325 }, { numbers: ['1', '324'], answer: 325 }],
              examplesTimeout: 1,
              rowsTimeout: 0.9,
              displayNumbers: true,
              fontRotation: 180,
              fontColor: 'green',
              fontSize: 1,
            },
          ]"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from "@vue/composition-api";
import BigNumbersGame from "@/views/games/big-numbers/game.vue";
import { QueueItem } from "@/views/games/big-numbers/interfaces";

export default defineComponent({
  components: { BigNumbersGame },
  props: {
    answerAtEnd: {
    type: Boolean,
    requied:  false
    },
  queue: {
    type: Array as PropType<QueueItem[]>,
    requied: true,
  },
  },
  setup(_, context) {
    const waitingGameInstancesCount = ref<number>(0);
    const hasFinished = computed(() => {
      return waitingGameInstancesCount.value === 9; // FIXME: static value
    });

    const columnClasses = computed(() => {
      const classes: string[] = [];

      classes.push("column");
      classes.push("is-12-mobile");

      if (hasFinished.value) {
        classes.push("is-6-tablet");
        classes.push("is-6-desktop");
      } else {
        classes.push("is-6-tablet");
        classes.push("is-4-desktop");
      }

      return classes;
    });

    function incrementWaitingInstances() {
      waitingGameInstancesCount.value++;

      if (hasFinished.value) {
        // FIXME: do not use the global instance
        context.root.$nextTick(() => {
          context.root.$emit("numbers-game:show-answers-form");
        });
      }
    }

    return {
      incrementWaitingInstances,
      columnClasses,
      hasFinished,
    };
  },
});
</script>
