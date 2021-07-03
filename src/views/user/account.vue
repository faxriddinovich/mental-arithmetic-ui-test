<template>
<!-- is-2 is-variable-->
<div class="columns is-flex is-vcentered is-centered" style="height: 100%">
  <div class="column is-4">
    <div class="columns is-mobile is-multiline is-centered">
      <div class="column is-12">
        <div class="box">
          <b-message type="is-warning">
            <b-icon icon="exclamation-triangle" /> <b>Low balance.</b> Please top up your balance.
          </b-message>
          <div class="is-flex is-justify-content-space-between pb-4">
            <div class="is-flex">
              <figure class="image is-64x64">
                <img src="https://avatars.dicebear.com/api/initials/mhw0.svg" />
              </figure>
              <div class="pl-4">
                <span class="is-size-4"><b-icon icon="user" /> mhw0</span><br />
                <span class="has-text-grey"><b-icon icon="envelope" />mhw0@yahoo.com</span>
              </div>
            </div>
            <div class="pl-6">
              <span><b-icon icon="coins" />25 482.00 sum</span><br />
              <span>
                <b-button type="is-success" size="is-small" outlined>+ Top up balance</b-button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-12">
        <b-button type="is-primary is-light" icon-left="arrow-left" expanded light>Go back</b-button>
      </div>
    </div>
  </div>
</div>
<!--
  <div class="is-flex is-justify-content-center" style="height: 100vh">
    <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <div class="box">
        <div class="is-flex is-align-items-center">
          <figure class="image is-64x64">
            <img src="https://avatars.dicebear.com/api/initials/mhw0.svg" />
          </figure>
          <div class="pl-4">
            <span class="is-size-4"><b-icon icon="user" /> mhw0</span><br />
            <span class="has-text-grey"><b-icon icon="envelope" />mhw0@yahoo.com</span>
          </div>
          <div class="pl-6">
            <span><b-icon icon="coins" />25 482.00 sum</span><br />
            <span><router-link to="/"><b-icon icon="plus-circle" />Top up balance</router-link></span>
          </div>
        </div>
        <br />
        <b-field label="Buy">
          <b-slider :min="30" :max="120" tooltip-always :custom-formatter="val => val + (val === 1 ? ' day' : ' days')" rounded></b-slider>
          <div><b>26 600.00 sum</b> (1 day = 700 sum)</div>
        </b-field>

        <b-field>
          <b-button type="is-primary" disabled expanded outlined><b-icon icon="shopping-cart" /><span>Buy</span></b-button>
        </b-field>
      </div>
    </div>
  </div>
  -->
</template>
