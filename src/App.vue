<template>
<bottom-bar-component />
</template>

<script lang="ts">
import BottomBarComponent from '@/components/BottomBar.vue';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: { BottomBarComponent }
})
export default class AppComponent extends Vue {

}
</script>

<style lang="scss">
// offline usage
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";

* {
  font-family: "Inter", sans-serif;
}

.top-level {
  background: #ecf0f1;
  height: 100vh;
  user-select: none;
}
</style>
