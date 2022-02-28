<template>
  <div class="card p-4 is-bordered">
    <form @submit.prevent="updateAccount" v-if="account">
      <b-field :label="$t('username')">
        <b-input
          v-model="tmpAccount.username"
          minlength="4"
          maxlength="20"
          :has-counter="false"
          required
        />
      </b-field>

      <b-field :label="$t('email')">
        <b-input
          type="email"
          v-model="tmpAccount.email"
          minlength="4"
          maxlength="20"
          :has-counter="false"
        />
      </b-field>

      <b-field :label="$t('password')">
        <b-input type="password" v-model="tmpAccount.password"></b-input>
      </b-field>

      <div class="has-text-right">
        <b-button
          native-type="submit"
          icon-left="save"
          type="is-success"
          :disabled="Object.keys(changedFields).length === 0"
          >{{ $t('save') }}</b-button
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
import { updatedDiff } from 'deep-object-diff';
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
    const account = ref<AccountContract | null>(null);
    const tmpAccount =  ref<AccountContract | null>(null);

    const changedFields = computed(() => {
      return updatedDiff(account.value!, tmpAccount.value!);
    });

    const getAccount = () => {
      rpc
        .call(RPC_GET_ACCOUNT_METHOD)
        .then((remoteAccount: AccountContract) => {
          account.value = remoteAccount;
          tmpAccount.value = Object.assign({}, remoteAccount);
        });
    };

    const updateAccount = () => {
      const params: Partial<UpdateOwnAccountContract> = {};

      for(const field of Object.keys(changedFields.value!))
        //@ts-ignore
        params[field] = tmpAccount.value[field];

      rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
        showToastMessage("Successfully saved!", ToastType.Success);
        account.value = Object.assign({}, tmpAccount.value);
      }).catch(() => {
        showToastMessage('Unable to save changes', ToastType.Danger);
      });;
    };

    onMounted(() => {
      getAccount();
    });

    return { tmpAccount, account, changedFields, updateAccount };
  },
});
</script>
