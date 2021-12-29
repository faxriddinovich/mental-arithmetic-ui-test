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
        v-for="(instanceItem, instanceItemIndex) of instances"
        :key="instanceItemIndex"
      >
        <BigNumbersGame
          :multiplayerMode="true"
          :answerAtEnd="answerAtEnd"
          :topBar="false"
          :onFinish="addWaitingInstance"
          :sequence="instanceItem.sequence"
        />
      </div>
    </div>
    <div v-else>
      <BigNumbersGame :sequence="instances[0].sequence" :answerAtEnd="instances[0].answerAtEnd" />
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
    instances: {
      type: Array as PropType<SequenceItem[][]>,
      requied: true,
    },
    multiplayerMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props, context) {
    const waitingInstancesCount= ref<number>(0);

    const allInstancesFinished = computed(() => {
        return waitingInstancesCount.value === props.instances?.length
    });

    const columnClasses = computed(() => {
      const classes: string[] = [];

      classes.push("column");
      classes.push("is-12-mobile");

      if (allInstancesFinished.value) {
        classes.push("is-12-mobile");
        classes.push("is-6-desktop");
      } else {
        classes.push("is-6-tablet");
        classes.push("is-4-desktop");
      }

      return classes;
    });

    function addWaitingInstance() {
      waitingInstancesCount.value++;

      if(allInstancesFinished.value)  {
        context.root.$nextTick(() => {
          context.root.$emit('display-answer-forms')
        });
      }
    }

    return {
      addWaitingInstance,
      columnClasses,
    };
  },
});
</script>
