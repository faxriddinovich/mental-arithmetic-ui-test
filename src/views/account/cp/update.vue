<template>
  <div>
    <div class="card p-3 mb-3 is-bordered">
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

        <b-field :label="$t('balance_in_soums')">
          <b-numberinput v-model="tmpAccount.balance"></b-numberinput>
        </b-field>

        <b-field :label="$t('role')">
          <b-select placeholder="Select a role" v-model="tmpAccount.role">
            <option value="default">{{ $t("default_role") }}</option>
            <option value="teacher">{{ $t("teacher_role") }}</option>
            <option value="root">root</option>
          </b-select>
        </b-field>

        <b-field :label="$t('blocked')">
          <b-switch v-model="tmpAccount.blocked">
            {{ account.blocked ? $t("yes") : $t("no") }}
          </b-switch>
        </b-field>

        <b-field :label="$t('password')">
          <b-input type="password" v-model="tmpAccount.password"></b-input>
        </b-field>
        <div class="buttons is-right">
          <b-button
            icon-left="times"
            type="is-danger"
            @click="displayDeleteAccountDialog"
            >{{ $t("delete") }}</b-button
          >
          <b-button
            native-type="submit"
            icon-left="save"
            type="is-success"
            :disabled="Object.keys(changedFields).length === 0"
            >{{ $t("save") }}</b-button
          >
        </div>
      </form>
    </div>
    <b-button
      tag="router-link"
      :to="{ name: 'ControlPanelAccounts' }"
      icon-left="arrow-left"
      expanded
      >{{ $t("back") }}</b-button
    >
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from "@vue/composition-api";
import { updatedDiff } from "deep-object-diff";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_ACCOUNT_METHOD,
  RPC_UPDATE_ACCOUNT_METHOD,
  RPC_DELETE_ACCOUNT_METHOD,
} from "@/services/rpc/methods";
import {
  UpdateAccountContract,
  AccountContract,
} from "@/services/rpc/contracts/account";

interface ExtendedAccountContract extends AccountContract {
  password: string;
}

export default defineComponent({
  setup(_, context) {
    const account = ref<ExtendedAccountContract | null>(null);
    const tmpAccount = ref<ExtendedAccountContract | null>(null);
    const changedFields = computed(() => {
      return updatedDiff(account.value!, tmpAccount.value!);
    });
    const accountId = Number(context.root.$route.params.id);

    function getAccount() {
      const accountId = Number(context.root.$route.params.id);
      rpc
        .call(RPC_GET_ACCOUNT_METHOD, { accountId })
        .then((remoteAccount: AccountContract) => {
          // FIXME: hard coded password field
          account.value = { ...remoteAccount, password: "" };
          tmpAccount.value = Object.assign({ password: "" }, remoteAccount);
        });
    }

    function updateAccount() {
      const params: UpdateAccountContract = { accountId };

      for (const field of Object.keys(changedFields.value)) {
        //@ts-ignore
        params[field] = tmpAccount.value[field];
      }

      rpc.call(RPC_UPDATE_ACCOUNT_METHOD, params).then(() => {
        showToastMessage(
          context.root.$i18n.t("successfully_saved_message") as string,
          ToastType.Success
        );
        account.value = Object.assign({}, tmpAccount.value);
      });
    }

    function deleteAccount() {
      rpc.call(RPC_DELETE_ACCOUNT_METHOD, { accountId }).then(() => {
        context.root.$router.push({ name: "ControlPanelAccounts" });
      });
    }

    function displayDeleteAccountDialog() {
      context.root.$buefy.dialog.confirm({
        message: context.root.$i18n.t("delete_confirmation_text") as string,
        onConfirm: () => deleteAccount(),
        confirmText: context.root.$i18n.t("yes") as string,
        cancelText: context.root.$i18n.t("cancel") as string,
        hasIcon: true,
        type: "is-danger",
        icon: "times",
      });
    }

    onMounted(() => {
      getAccount();
    });

    return {
      account,
      updateAccount,
      displayDeleteAccountDialog,
      changedFields,
      tmpAccount,
    };
  },
});
</script>
