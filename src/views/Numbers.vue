<template>
  <div class="is-flex is-justify-content-space-around is-align-items-center pt-4 px-4">
    <div class="card p-5 top-btn"><b-icon icon="redo" size="is-large" type="is-primary"/></div>
    <div class="is-4">
    <b-progress :value="80" type="is-primary" size="is-large" show-value format="percent"></b-progress>

    </div>
    <div class="card p-5 top-btn"><b-icon icon="home" size="is-large" type="is-primary"/></div>
  </div>
</template>
<style lang="scss" scoped>
.top-btn {
  border-radius: 100%;
}
</style>
