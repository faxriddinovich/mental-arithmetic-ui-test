<template>
  <div class="columns is-marginless is-mobile is-multiline is-centered is-vcentered" style="height: 100vh">
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'green',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'green',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'green',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }, { numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'red',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'orange',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'purple',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'yellow',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'blue',
            fontSize: 1,
          },
        ]"
      />
    </div>
    <div class="column is-4-desktop is-6-tablet is-12-mobile">
      <NumbersGame
        :multiplayerMode="true"
        :topBar="false"
        :queue="[
          {
            theme: 'theme1',
            examples: [{ numbers: ['1', '324'], answer: 325 }],
            examplesTimeout: 1,
            rowsTimeout: 1,
            displayNumbers: true,
            fontRotation: 0,
            fontColor: 'black',
            fontSize: 1,
          },
        ]"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent } from "@vue/composition-api";
import NumbersGame from "@/components/games/numbers/game.vue";

export default defineComponent({
  components: { NumbersGame },
  setup() {
    function test() {
      alert("next");
    }
    return { test };
  },
});
</script>
