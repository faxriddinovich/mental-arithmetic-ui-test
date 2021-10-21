<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="saveChanges" v-if="account">
      <b-field label="Username">
        <b-input
          v-model="localAccount.username"
          minlength="4"
          maxlength="20"
          :has-counter="false"
          required
        />
      </b-field>

      <b-field label="Email">
        <b-input
          type="email"
          v-model="localAccount.email"
          minlength="4"
          maxlength="20"
          :has-counter="false"
        />
      </b-field>

      <b-field label="Password">
        <b-input type="password" v-model="localAccount.password"></b-input>
      </b-field>

      <div class="has-text-right">
        <b-button
          native-type="submit"
          icon-left="save"
          type="is-success"
          :disabled="!fieldDiff"
          >Save</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { diff } from "deep-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNT_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import { AccountContract } from "@/services/rpc/contracts/account";

@Component
export default class UpdateAccount extends Vue {
  public account: AccountContract | null = null;
  public localAccount: AccountContract | null = null;

  mounted() {
    this.getAccount();
  }

  public get fieldDiff() {
    return diff(this.account, this.localAccount);
  }

  public getAccount() {
    rpc.call(RPC_GET_ACCOUNT_METHOD).then((account) => {
      this.account = account;
      this.localAccount = Object.assign({}, account);
    });
  }

  // FIXME: fix typescript types
  public saveChanges() {
    const params = {};
    for (const field of this.fieldDiff) {
      params[field.path[0]] = field.rhs;
    }

    rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
      // after updating the account, "local account" becomes "actual account"
      this.account = Object.assign({}, this.localAccount);
      showToastMessage("Successfully saved!", ToastType.Success);
    });
  }
}
</script>
