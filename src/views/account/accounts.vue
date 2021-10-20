<template>
  <div>
<div v-if="account">
    <div class="card p-3 mb-3 is-bordered">
      <form @submit.prevent="saveChanges">
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

        <b-field label="Balance">
          <b-numberinput v-model="localAccount.balance"></b-numberinput>
        </b-field>

        <b-field label="Role">
          <b-select placeholder="Select a role" v-model="localAccount.role">
            <option value="default">default</option>
            <option value="teacher">teacher</option>
            <option value="root">root</option>
          </b-select>
        </b-field>

        <b-field label="Password">
          <b-input type="password" v-model="localAccount.password"></b-input>
        </b-field>

        <div class="has-text-right">
          <b-button native-type="submit" icon-left="save" type="is-success"
            :disabled="!fieldDiff">Save</b-button
          >
        </div>
      </form>
    </div>
<b-button icon-left="arrow-left" @click="account = null" expanded>Back</b-button>
</div>

<div v-if="!account">
    <div class="card p-3 mb-3 is-bordered">
    <div class="is-flex">
        <b-input
          class="is-flex-grow-1"
          placeholder="Username etc.."
          icon="search"
        >
        </b-input>
        <b-button
          native-type="submit"
          type="is-primary"
          class="ml-3"
          icon-left="search"
          >Search</b-button
        >
        </div>

    </div>
    <div class="card p-3 is-bordered">
        <article class="media m-0 py-2" v-for="(account, index) of accounts" :key="index">
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
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import Avatar from "vue-avatar";
import { diff } from 'deep-diff';
import { showToastMessage, ToastType } from '@/services/toast';
import { rpc } from "@/services/rpc";
import { RPC_GET_ACCOUNTS_METHOD, RPC_UPDATE_ACCOUNT_METHOD } from "@/services/rpc/methods";
import { avatarFactory, formatCurrency } from "@/common/utils";

@Component({ components: { Avatar } })
export default class Accounts extends Vue {
  public accounts = [];

  public localAccount = null;
  public account = null;

  public avatarFactory = avatarFactory;
  public formatCurrency = formatCurrency;

  public get fieldDiff() {
    return diff(this.account, this.localAccount);
  }

  mounted() {
    this.getAccounts();
  }

  public pickAccount(index: number) {
    const account = this.accounts[index];
    this.account = Object.assign({}, account);
    this.localAccount = Object.assign({}, account);
  }

  //FIXME: fix typescript types
  public saveChanges() {
    const params = {};

    for(const diff of this.fieldDiff) {
      params[diff.path[0]] = diff.rhs;
    }

    rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
      this.account = Object.assign({}, this.localAccount);
      showToastMessage("Successfully updated!", ToastType.Success);
    });
  }

  public getAccounts() {
    rpc.call(RPC_GET_ACCOUNTS_METHOD).then((accounts) => {
      this.accounts = accounts;
    });
  }
}
</script>
