<template>
  <div class="card p-4 is-bordered">
    <form>
      <b-field label="Username">
        <b-input v-model="account.username"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input v-model="account.email"></b-input>
      </b-field>

      <div class="has-text-right">
        <b-button icon-left="save" type="is-success">Save</b-button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/rpc/rpc";
import { RPC_GET_ACCOUNT_METHOD } from "@/rpc/methods";

@Component
export default class UpdateAccount extends Vue {
  public account!: any = null;

  mounted() {
    rpc.call(RPC_GET_ACCOUNT_METHOD).then((account) => {
      this.account = account;
    });
  }
}
</script>
