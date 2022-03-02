<template>
  <div class="card px-3 is-bordered">
    <nav class="level py-6">
      <div class="level-item has-text-centered">
        <div v-if="subscription">
          <p class="heading">{{ $t("subscription_expires") }}</p>
          <p class="title">
            {{ formatDate(subscription.date) }}
          </p>
          <p class="mt-5">
            <!--
            <b-button type="is-primary" icon-left="pen"
              >Renew subscription</b-button
            >
            -->
            <b-button
              type="is-warning"
              icon-left="times"
              @click="displayCancelDialog"
              >{{ $t("cancel_subscription") }}</b-button
            >
          </p>
        </div>
        <div v-else>
          <form @submit.prevent="displayConfirmDialog">
            <p class="mb-4">
              <b-field :label="$t('how_many_days')">
                <b-numberinput v-model="days" minlength="32"></b-numberinput>
              </b-field>
            </p>
            <p>
              <b-button
                native-type="submit"
                type="is-primary"
                icon-left="shopping-basket"
                :disabled="days === 0"
                >{{ $t("purchase") }}</b-button
              >
            </p>
          </form>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_SUBSCRIPTION_METHOD,
  RPC_CANCEL_SUBSCRIPTION_METHOD,
  RPC_PURCHASE_SUBSCRIPTION_METHOD,
} from "@/services/rpc/methods";
import { RPC_INSUFFICIENT_BALANCE_ERR_CODE } from "@/services/rpc/error-codes";
import { acquireSetting } from "@/store/setting";
import { format } from "date-fns";
import { uz, ru, enUS } from "date-fns/locale";

export default defineComponent({
  setup(_, context) {
    const subscription = ref(null);
    const days = ref<number>(0);
    const locale = acquireSetting().one("locale");

    function getSubscription() {
      rpc.call(RPC_GET_SUBSCRIPTION_METHOD).then((result) => {
        subscription.value = result;
      });
    }

    function formatDate(date: number) {
      let loc;

      if (locale === "uz-UZ") loc = uz;
      else if (locale === "en-EN") loc = enUS;
      else if (locale === "ru-RU") loc = ru;

      return format(Number(date), "PPPpp", { locale: loc });
    }

    function cancelSubscription() {
      rpc.call(RPC_CANCEL_SUBSCRIPTION_METHOD).then(() => {
        context.root.$router.push({ name: "Home" });
      });
    }

    function displayCancelDialog() {
      context.root.$buefy.dialog.confirm({
        title: context.root.$i18n.t("cancel_subscription") as string,
        message: context.root.$i18n.t(
          "cancel_subscription_confirmation_text"
        ) as string,
        confirmText: context.root.$i18n.t("yes") as string,
        cancelText: context.root.$i18n.t("cancel") as string,
        type: "is-warning",
        onConfirm: () => cancelSubscription(),
      });
    }

    function displayConfirmDialog() {
      context.root.$buefy.dialog.confirm({
        title: context.root.$i18n.t("purchase") as string,
        message: context.root.$i18n.t(
          "purchase_subscription_confirmation_text"
        ) as string,
        confirmText: context.root.$i18n.t("yes") as string,
        cancelText: context.root.$i18n.t("cancel") as string,
        type: "is-warning",
        onConfirm: () => purchaseSubscription(),
      });
    }

    function purchaseSubscription() {
      rpc
        .call(RPC_PURCHASE_SUBSCRIPTION_METHOD, { days: days.value })
        .then(() => {
          context.root.$router.push({ name: "Home" });
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_INSUFFICIENT_BALANCE_ERR_CODE) {
              showToastMessage(
                context.root.$i18n.t("insufficient_balance") as string,
                ToastType.Danger
              );
            }
          }
        });
    }

    onMounted(() => {
      getSubscription();
    });

    return {
      displayConfirmDialog,
      displayCancelDialog,
      subscription,
      formatDate,
      days,
    };
  },
});
</script>
