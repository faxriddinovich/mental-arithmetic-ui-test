<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="saveChanges" v-if="account">
      <b-field label="Username">
        <b-input
          v-model="account.username"
          minlength="4"
          maxlength="20"
          :has-counter="false"
          required
        />
      </b-field>

      <b-field label="Email">
        <b-input
          type="email"
          v-model="account.email"
          minlength="4"
          maxlength="20"
          :has-counter="false"
        />
      </b-field>

      <b-field label="Password">
        <b-input type="password" v-model="account.password"></b-input>
      </b-field>

      <div class="has-text-right">
        <b-button native-type="submit" icon-left="save" type="is-success"
          >Save</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNT_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import { AccountContract } from "@/services/rpc/contracts/account";

@Component
export default class UpdateAccount extends Vue {
  public get account() {
    return this.$store.getters.cachedAccount;
  }

  public saveChanges() {
    const { username, email, password } = this.account;
    rpc
      .call(RPC_UPDATE_ACCOUNT_METHOD, { username, email, password })
      .then(() => {
        this.$buefy.toast.open({
          type: "is-success",
          message: "Successfully saved!",
        });
      });
  }
}
</script>
