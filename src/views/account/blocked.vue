<template>
  <div class="container is-max-widescreen">
    <div
      class="columns is-centered is-vcentered is-mobile m-0"
      style="height: 100vh"
    >
      <b-message type="is-danger" has-icon>
        <span class="has-text-weight-semibold">Your account is blocked!</span
        ><br />
        Please contact administrators.<br />You have an access to the
        <router-link :to="{ name: 'AccountSessions' }"
          >Sessions page</router-link
        >.
      </b-message>
    </div>
  </div>
</template>
