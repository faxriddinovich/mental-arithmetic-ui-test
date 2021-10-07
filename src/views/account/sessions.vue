<template>
  <div class="card p-2 is-bordered">
<article class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img src="https://bulma.io/images/placeholders/128x128.png">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>mhw0</strong> <small>@johnsmith</small> <small>31m</small>
        <br>
2
      </p>
    </div>
  </div>
  <div class="media-right">
    <button class="delete"></button>
  </div>
</article>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Database } from '@/services/indexeddb/database';

@Component
export default class Sessions extends Vue {
  public sessions = null;

  mounted() {
    Database.getSessions().then((sessions) => this.sessions = sessions);
  }
}
</script>
