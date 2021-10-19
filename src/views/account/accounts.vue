<template>
  <div>
<div v-if="pickedAccount">
    <div class="card p-3 mb-3 is-bordered">
      <form @submit.prevent="saveChanges">
        <b-field label="Username">
          <b-input
            v-model="pickedAccount.username"
            minlength="4"
            maxlength="20"
            :has-counter="false"
            required
          />
        </b-field>

        <b-field label="Email">
          <b-input
            type="email"
            v-model="pickedAccount.email"
            minlength="4"
            maxlength="20"
            :has-counter="false"
          />
        </b-field>

        <b-field label="Balance">
          <b-numberinput v-model="pickedAccount.balance"></b-numberinput>
        </b-field>

        <b-field label="Role">
          <b-select placeholder="Select a role" v-model="pickedAccount.role">
            <option value="default">default</option>
            <option value="teacher">teacher</option>
            <option value="root">root</option>
          </b-select>
        </b-field>

        <b-field label="Password">
          <b-input type="password" v-model="pickedAccount.password"></b-input>
        </b-field>

        <div class="has-text-right">
          <b-button native-type="submit" icon-left="save" type="is-success"
            >Save</b-button
          >
        </div>
      </form>
    </div>
<b-button icon-left="arrow-left" @click="pickedAccount = null" expanded>Back</b-button>
</div>

<div v-if="!pickedAccount">
    <div class="card p-3 mb-3 is-bordered"></div>
    <div class="card p-3 is-bordered">
      <div v-for="(account, index) of accounts" :key="index">
        <article class="media mb-2">
          <figure class="media-left">
            <avatar :src="avatarFactory(account.username)" :size="50"></avatar>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ account.username }}</strong>
                <span class="ml-1"
                  ><b-icon icon="envelope-alt" />{{ account.email }}</span
                >
                <br />
                2021-10-19T09:06:57.617
              </p>
            </div>
          </div>
          <div class="media-right">
            <b-button
              @click="pickAccount(index)"
              type="is-primary"
              size="is-small"
              icon-left="pen"
              >Edit</b-button
            >
          </div>
        </article>
      </div>
    </div>
</div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import Avatar from "vue-avatar";
import { rpc } from "@/services/rpc";
import { RPC_GET_ACCOUNTS_METHOD } from "@/services/rpc/methods";
import { avatarFactory, formatCurrency } from "@/common/utils";

@Component({ components: { Avatar } })
export default class Accounts extends Vue {
  public accounts = [];

  public pickedAccount = null;
  public isInfoModalActive = true;

  public avatarFactory = avatarFactory;
  public formatCurrency = formatCurrency;

  mounted() {
    this.getAccounts();
  }

  public pickAccount(index: number) {
    this.pickedAccount = this.accounts[index];
  }

  public saveChanges() { /* */ }

  public getAccounts() {
    rpc.call(RPC_GET_ACCOUNTS_METHOD).then((accounts) => {
      this.accounts = accounts;
    });
  }
}
</script>
