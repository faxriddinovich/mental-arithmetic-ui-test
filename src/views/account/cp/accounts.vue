<template>
  <div>
    <div class="card p-3 mb-3 is-bordered">
      <form @submit.prevent="getAccounts" class="is-flex">
        <b-input
          v-model="searchText"
          class="is-flex-grow-1"
          :placeholder="$t('search_accounts_input_placeholder')"
          icon="search"
        >
        </b-input>
        <b-button
          native-type="submit"
          type="is-primary"
          class="ml-3"
          icon-left="search"
          >{{ $t("search") }}</b-button
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
              <p class="is-clipped">
                <strong>#{{ account.id }} {{ account.username }}</strong>
                <b-icon
                  icon="check-circle"
                  class="ml-1"
                  type="is-info"
                  v-if="account.role === 'root'"
                />
                <br />
                <span v-if="account.email"
                  ><b-icon icon="envelope-alt" />{{ account.email }}</span
                >
              </p>
            </div>
          </div>
          <div class="media-right">
            <b-button
              tag="router-link"
              :to="{
                name: 'ControlPanelUpdateAccount',
                params: { id: account.id },
              }"
              type="is-primary"
              size="is-small"
              icon-left="pen"
              >{{ $t("edit") }}</b-button
            >
          </div>
        </article>
      </div>
      <div class="has-text-centered has-text-weight-semibold" v-else>
        {{ $t("no_accounts_found") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { rpc } from "@/services/rpc";
import { RPC_GET_ACCOUNTS_METHOD } from "@/services/rpc/methods";
import { avatarFactory } from "@/common/utils";
import { AccountContract } from "@/services/rpc/contracts/account";

export default defineComponent({
  setup() {
    const accounts = ref<AccountContract[] | null>(null);
    const searchText = ref<string>("");

    function getAccounts() {
      const params = searchText.value.length
        ? { searchText: searchText.value }
        : undefined;
      rpc.call(RPC_GET_ACCOUNTS_METHOD, params).then((result) => {
        accounts.value = result;
      });
    }

    onMounted(() => {
      getAccounts();
    });

    return {
      accounts,
      searchText,
      getAccounts,
      avatarFactory,
    };
  },
});
</script>
