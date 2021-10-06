<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="saveChanges" v-if="account">
      <b-field label="Username">
        <b-input v-model="account.username"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input v-model="account.email"></b-input>
      </b-field>

      <b-field label="Password">
        <b-input type="password" v-model="account.password"></b-input>
      </b-field>

      <div class="has-text-right">
        <b-button
          native-type="submit"
          icon-left="save"
          type="is-success"
          :disabled="!canSave"
          >Save</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import {
  RPC_GET_ACCOUNT_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
} from "@/rpc/methods";
import { AccountContract } from "@/rpc/contracts/account";

@Component
export default class UpdateAccount extends Vue {
  public account: AccountContract | null = null;
  public actualAccount: AccountContract | null = null;

  mounted() {
    rpc.call(RPC_GET_ACCOUNT_METHOD).then((account) => {
      this.account = account;
      this.actualAccount = Object.assign({}, account);
    });
  }

  public get canSave() {
    const { account, actualAccount } = this;
    return (
      account &&
      Object.keys(account).some((key) => account[key] !== actualAccount[key])
    );
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
