<template>
  <div>
    <div
      class="
        columns
        is-marginless is-mobile is-multiline is-centered is-vcentered
      "
      style="min-height: 100vh"
      v-if="multiplayerMode"
    >
      <div
        :class="columnClasses"
        v-for="(sequenceItem, sequenceItemIndex) of sequences"
        :key="sequenceItemIndex"
      >
        <BigNumbersGame
          :multiplayerMode="true"
          :answerAtEnd="answerAtEnd"
          :topBar="false"
          :onSequenceFinish="incrementWaitingInstances"
          :sequence="[sequenceItem]"
        />
      </div>
    </div>
    <div v-else>
      <BigNumbersGame :sequence="sequence" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from "@vue/composition-api";
import BigNumbersGame from "@/views/games/big-numbers/game.vue";
import { SequenceItem } from "@/views/games/big-numbers/interfaces";

export default defineComponent({
  components: { BigNumbersGame },
  props: {
    answerAtEnd: {
      type: Boolean,
      requied: false,
    },
    sequence: {
      type: Array as PropType<SequenceItem[]>,
      requied: true,
    },
    multiplayerMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, context) {
    const waitingGameInstancesCount = ref<number>(0);
    const hasFinished = computed(() => {
      return waitingGameInstancesCount.value === props.sequence?.length; // FIXME: static value
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
