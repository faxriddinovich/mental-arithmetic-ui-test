<template>
  <div class="card px-3 is-bordered">
    <nav class="level py-6">
      <div class="level-item has-text-centered">
        <div v-if="subscription">
          <p class="heading">Your subscription expires</p>
          <p class="title" v-if="subscription">{{ subscription.date }}</p>
          <p class="mt-5 buttons">
            <b-button type="is-primary" icon-left="pen"
              >Renew subscription</b-button
            >
            <b-button type="is-warning" icon-left="times" @click="confirmCancel"
              >Cancel subscription</b-button
            >
          </p>
        </div>
        <div v-else>
          <form @submit.prevent="purchaseSubscription">
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

    <hr class="m-0" />
    <div class="px-2 py-4">
      <div class="has-text-weight-semibold">Subscription features:</div>
      <div>
        - You will be able to use games such as ... (even without internet
        connection)
      </div>
      <div>
        - If your role is "teacher" on the platform, then you will be able to
        create courses
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { rpc } from "@/services/rpc";
import {
  RPC_GET_SUBSCRIPTION_METHOD,
  RPC_CANCEL_SUBSCRIPTION_METHOD,
  RPC_PURCHASE_SUBSCRIPTION_METHOD,
} from "@/services/rpc/methods";

@Component
export default class Subscription extends Vue {
  public subscription = null;
  public hasSubscription = false;
  public days = 30;

  mounted() {
    this.getSubscription();
  }

  public getSubscription() {
    rpc.call(RPC_GET_SUBSCRIPTION_METHOD).then((subscription) => {
      this.subscription = subscription;
      this.hasSubscription = true;
    });
  }

  public confirmCancel() {
    this.$buefy.dialog.confirm({
      title: "Cancel the subscription",
      message: "Do you really want to cancel the subscription?",
      type: "is-warning",
      onConfirm: () => this.cancelSubscription(),
    });
  }

  public cancelSubscription() {
    rpc.call(RPC_CANCEL_SUBSCRIPTION_METHOD).then(() => {
      this.$router.go(0);
    });
  }

  public purchaseSubscription() {
    rpc.call(RPC_PURCHASE_SUBSCRIPTION_METHOD, { days: this.days }).then(() => {
      this.$router.go(0);
    });
  }
}
</script>
