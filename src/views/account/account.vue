<template>
  <div class="container is-max-widescreen">
    <div class="px-2 py-2">
      <div class="columns is-desktop is-multiline">
        <div class="column is-12-mobile is-4-desktop">
          <div
            class="
              card
              is-bordered
            "
          >
<div class="has-background-primary" style="height: 100px">
</div>
<div class="is-flex is-flex-direction-column is-align-items-center py-2" style="margin-top: -70px">
            <avatar
              src="https://picsum.photos/600/400"
              :size="140"
              username="mhw0"
            ></avatar>
            <div class="has-text-weight-semibold is-size-4 mt-2">mhw0</div>
            <div>mhw0@yahoo.com</div>
</div>
          </div>

          <div class="card mt-2 p-2 is-bordered">
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Balance</p>
                  <p class="title">28.000</p>
                </div>
              </div>
            </nav>
          </div>
          <div class="card mt-2 p-2 is-bordered">
            <b-menu :activable="false">
              <b-menu-list label="Account">
                <b-menu-item
                  icon="user-exclamation"
                  label="Update account"
                ></b-menu-item>
                <b-menu-item icon="users-alt" label="Sessions"></b-menu-item>
              </b-menu-list>
              <b-menu-list label="Control panel" v-if="session && session.role === 'root'">
                <b-menu-item
                  icon="setting"
                  label="Platform settings"
                ></b-menu-item>
                <b-menu-item icon="users-alt" label="Users"></b-menu-item>
              </b-menu-list>
            </b-menu>
          </div>
<b-button tag="router-link" :to="{ name: 'MainResources' }" icon-left="home" class="mt-2" outlined expanded>Home</b-button>
        </div>
        <div class="column">
          <div class="card is-bordered">2</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import Avatar from "vue-avatar";
import { rpc } from '@/rpc/rpc';
import { RPC_GET_ACCOUNT_METHOD } from '@/rpc/methods';
import { Base } from "@/mixins/base.mixin";

@Component({ components: { Avatar } })
export default class Account extends Mixins(Base) {
  //public account: 
}
</script>
