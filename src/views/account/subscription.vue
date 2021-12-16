<template>
  <div class="card px-3 is-bordered">
    <nav class="level py-6">
      <div class="level-item has-text-centered">
        <div v-if="subscription">
          <p class="heading">Your subscription expires</p>
          <p class="title" v-if="subscription">
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
              >Cancel subscription</b-button
            >
          </p>
        </div>
        <div v-else>
          <form @submit.prevent="displayConfirmDialog">
            <p class="mb-4">
              <b-field label="For how many days?">
                <b-numberinput v-model="days" minlength="32"></b-numberinput>
              </b-field>
            </p>
            <p>
              <b-button
                native-type="submit"
                type="is-primary"
                icon-left="shopping-basket"
                >Buy subscription</b-button
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
import moment from "moment";
import { SettingsStorage } from "@/services/storages/settings";

export default defineComponent({
  setup(_, context) {
    const subscription = ref(null);
    const days = ref<number>(0);
    const locale = ref<string>("en");

    SettingsStorage.getSetting("locale").then((result) => {
      locale.value = result;
    });

    function getSubscription() {
      rpc.call(RPC_GET_SUBSCRIPTION_METHOD).then((result) => {
        subscription.value = result;
      });
    }

    function formatDate(date: number) {
      return moment(new Date(Number(date)))
        .locale(locale.value)
        .format("MMMM Do YYYY, h:mm a");
    }

    function cancelSubscription() {
      rpc.call(RPC_CANCEL_SUBSCRIPTION_METHOD).then(() => {
        context.root.$router.go(0);
      });
    }

    function displayCancelDialog() {
      context.root.$buefy.dialog.confirm({
        title: "Cancel the subscription",
        message: "Do you really want to cancel the subscription?",
        type: "is-warning",
        onConfirm: () => cancelSubscription(),
      });
    }

    function displayConfirmDialog() {
      context.root.$buefy.dialog.confirm({
        title: "Purchase a subscription",
        message: "Do you really want to purchase ?",
        type: "is-warning",
        onConfirm: () => purchaseSubscription(),
      });
    }

    function purchaseSubscription() {
      rpc
        .call(RPC_PURCHASE_SUBSCRIPTION_METHOD, { days: days.value })
        .then(() => {
          context.root.$router.go(0);
        })
        .catch((error) => {
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_INSUFFICIENT_BALANCE_ERR_CODE) {
              showToastMessage("Insufficient balance", ToastType.Danger);
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
      days,
      formatDate,
    };
  },
});
</script>
