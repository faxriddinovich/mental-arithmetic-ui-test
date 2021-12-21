<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="updateAccount" v-if="account">
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
          :disabled="!changed"
          >Save</b-button
        >
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted,
} from "@vue/composition-api";
import { diff } from "deep-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNT_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import {
  AccountContract,
  UpdateOwnAccountContract ,
} from "@/services/rpc/contracts/account";

export default defineComponent({
  setup() {
    const localAccount = ref<AccountContract | null>();
    const account = ref<AccountContract | null>(null);

    const changed = computed(() => {
      return diff(localAccount.value, account.value);
    });

    const getAccount = () => {
      rpc
        .call(RPC_GET_ACCOUNT_METHOD)
        .then((remoteAccount: AccountContract) => {
          account.value = remoteAccount;
          localAccount.value = Object.assign({}, remoteAccount);
        });
    };

    const updateAccount = () => {
      const params: UpdateOwnAccountContract = {};

      for (const change of changed.value!) {
        params[change!.path![0]] = (change as any).lhs; // FIXME
      }

      rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
        showToastMessage("Successfully saved!", ToastType.Success);
      }).catch(() => {
        showToastMessage('Unable to save changes', ToastType.Danger);
      });;
    };

    onMounted(() => {
      getAccount();
    });

    return { localAccount, account, changed, updateAccount };
  },
});
</script>
