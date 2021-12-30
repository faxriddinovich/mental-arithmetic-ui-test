<template>
    <div class="is-unselectable" ref="container">
      <router-view :key="$route.fullPath" />
    </div>
</template>
<style lang="scss">
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";
@import "https://unicons.iconscout.com/release/v4.0.0/css/solid.css";
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100&display=swap");
@import "bulma/sass/utilities/mixins";


html,
body {
  background-color: #ecf3f4;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 0;
}

.is-bottom-left {
  position: absolute;
  bottom: 6px;
  left: 6px;
}
</style>
