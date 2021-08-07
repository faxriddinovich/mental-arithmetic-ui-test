<template>
  <div>
    <div class="columns is-flex is-vcentered is-centered" style="height: 100vh">
      <div class="column is-4">
        <div class="columns is-mobile is-multiline is-centered">
          <div class="column is-12">
            <div class="box">
              <h2><b>It works</b></h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {}
</script>
