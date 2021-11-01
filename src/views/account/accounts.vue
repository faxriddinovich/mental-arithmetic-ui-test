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

          <b-field label="Blocked">
            <b-switch v-model="localAccount.blocked">
              {{ localAccount.blocked ? "Yes" : "No" }}
            </b-switch>
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
      <b-button icon-left="arrow-left" @click="account = null" expanded
        >Back</b-button
      >
    </div>

    <div v-if="!account">
      <div class="card p-3 mb-3 is-bordered">
        <form @submit.prevent="getAccounts" class="is-flex">
          <b-input
            v-model="searchText"
            class="is-flex-grow-1"
            placeholder="Username etc.."
            icon=""
          >
          </b-input>
          <b-button
            native-type="submit"
            type="is-primary"
            class="ml-3"
            icon-left="search"
            >Search</b-button
          >
        </form>
      </div>
      <div class="card px-3 py-2 is-bordered">
        <div v-if="accounts.length">
          <article
            class="media m-0 py-2"
            v-for="(account, index) of accounts"
            :key="index"
          >
            <figure class="media-left">
              <b-image
                class="is-64x64"
                :src="avatarFactory(account.username)"
                rounded
              />
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>#{{ account.id }} {{ account.username }}</strong>
                  <span class="ml-1" v-if="account.email"
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
        <div class="has-text-centered has-text-weight-semibold" v-else>
          No accounts found
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Vue } from "vue-property-decorator";
import { diff } from "deep-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNTS_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import { avatarFactory, formatCurrency } from "@/common/utils";

@Component
export default class Accounts extends Vue {
  public searchText = "";
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
    const params = {
      accountId: this.account.id,
    };

    for (const diff of this.fieldDiff) {
      params[diff.path[0]] = diff.rhs;
    }

    rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
      this.account = Object.assign({}, this.localAccount);
      showToastMessage("Successfully updated!", ToastType.Success);
    });
  }

  //FIXME: fix typescript types
  public getAccounts() {
    const params = this.searchText.length
      ? { text: this.searchText }
      : undefined;
    rpc.call(RPC_GET_ACCOUNTS_METHOD, params).then((accounts) => {
      this.accounts = accounts;
    });
  }
}
</script>
