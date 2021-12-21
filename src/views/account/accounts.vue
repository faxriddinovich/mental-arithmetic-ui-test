<template>
  <div>
    <div v-if="pickedAccount">
      <div class="card p-3 mb-3 is-bordered">
        <form @submit.prevent="updateAccount">
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

          <div class="buttons is-justify-content-right">
            <b-button
              icon-left="times"
              type="is-danger"
              @click="displayDeleteAccountDialog"
              >Delete</b-button
            >
            <b-button
              native-type="submit"
              icon-left="save"
              type="is-success"
              :disabled="!changed"
              >Save</b-button
            >
          </div>
        </form>
      </div>
      <b-button icon-left="arrow-left" @click="pickedAccount = null" expanded
        >Back</b-button
      >
    </div>

    <div v-if="!pickedAccount">
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
        <div v-if="accounts && accounts.length">
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
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import { diff } from "deep-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNTS_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
  RPC_DELETE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import { avatarFactory } from "@/common/utils";
import {
  AccountContract,
  UpdateAccountContract,
} from "@/services/rpc/contracts/account";

export default defineComponent({
  setup(_, context) {
    const accounts = ref<AccountContract[] | null>(null);
    const searchText = ref<string>("");

    const localAccount = ref<AccountContract | null>(null);
    const pickedAccount = ref<AccountContract | null>(null); // TODO: is this ok?

    const changed = computed(() => {
      return diff(localAccount.value, pickedAccount.value);
    });

    function pickAccount(index: number) {
      const account = accounts.value![index];
      pickedAccount.value = Object.assign({}, account);
      localAccount.value = Object.assign({}, account);
    }

    function getAccounts() {
      const params = searchText.value.length
        ? { searchText: searchText.value }
        : undefined;
      rpc.call(RPC_GET_ACCOUNTS_METHOD, params).then((result) => {
        accounts.value = result;
      });
    }

    function deleteAccount() {
      rpc
        .call(RPC_DELETE_ACCOUNT_METHOD, { accountId: pickedAccount.value!.id })
        .then(() => {
          showToastMessage("Successfully deleted!", ToastType.Warning);
          context.root.$router.push({ name: "Accounts" });
        });
    }

    function displayDeleteAccountDialog() {
      context.root.$buefy.dialog.confirm({
        message: "Do you really want to delete this account?",
        onConfirm: () => deleteAccount(),
        type: "is-danger",
        hasIcon: true,
        icon: "times",
      });
    }

    function updateAccount() {
      const params: UpdateAccountContract = {
        accountId: pickedAccount.value!.id,
      };
      console.log(changed.value);

      for (const change of changed.value!) {
        params[change.path[0]] = (change as any).lhs; // FIXME
      }

      rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
        pickedAccount.value = Object.assign({}, localAccount.value);
        showToastMessage("Successfully updated!", ToastType.Success);
      });
    }

    onMounted(() => {
      getAccounts();
    });

    return {
      changed,
      accounts,
      localAccount,
      pickedAccount,
      searchText,
      displayDeleteAccountDialog,
      getAccounts,
      updateAccount,
      pickAccount,
      avatarFactory,
    };
  },
});
</script>
