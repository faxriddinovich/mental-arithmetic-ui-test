<template><div>

      <NumbersGame
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 2 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'green',
            fontSize: 1,
          },
        ]"
      />

</div></template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import NumbersGame from '@/components/games/numbers/game.vue';

export default defineComponent({
  components: { NumbersGame },
  setup() {
  //
  }
})
</script>
