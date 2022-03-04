<template>
  <div class="container is-max-widescreen">
    <div class="px-2 py-2">
      <div class="columns is-desktop is-multiline">
        <div class="column is-12-mobile is-4-desktop">
          <div class="card is-bordered" v-if="activeSession">
            <div class="has-background-primary" style="height: 100px"></div>
            <div
              class="
                is-flex is-flex-direction-column is-align-items-center
                mb-3
              "
              style="margin-top: -60px"
              v-if="account"
            >
              <b-image
                class="is-128x128"
                :src="avatarFactory(account.username)"
                rounded
              />
              <div class="has-text-weight-semibold is-size-4 mt-2">
                {{ account.username }}
              </div>
              <div>{{ account.email }}</div>
            </div>

            <div class="mb-3" style="margin-top: -60px" v-else>
              <b-skeleton
                width="120px"
                height="120px"
                position="is-centered"
                :animated="false"
                circle
              />
              <b-skeleton width="160px" position="is-centered" />
              <b-skeleton width="200px" position="is-centered" />
            </div>
            <div>
              <hr class="is-marginless" />
              <nav class="level p-3">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">{{ $t('balance_in_soums') }}</p>
                    <!-- <p class="title">28.000</p> -->
                    <p class="title">
                      <span v-if="account">{{
                        account.balance | formatCurrency
                      }}</span>
                      <b-skeleton width="150px" height="36px" v-else />
                    </p>
                  </div>
                </div>
              </nav>
            </div>
          </div>
          <div class="card mt-2 p-2 is-bordered">
            <b-menu :activable="false">
              <b-menu-list>
                <b-menu-item
                  icon="users-alt"
                  :label="$t('sessions')"
                  tag="router-link"
                  :to="{ name: 'AccountSessions' }"
                  :active="$route.name === 'AccountSessions'"
                ></b-menu-item>
              </b-menu-list>
            </b-menu>
          </div>
          <div class="card mt-2 p-2 is-bordered" v-if="activeSession">
            <b-menu :activable="false">
              <b-menu-list :label="$t('account')">
                <b-menu-item
                  icon="user-exclamation"
                  :label="$t('update_account')"
                  tag="router-link"
                  :to="{ name: 'UpdateAccount' }"
                  :active="$route.name === 'UpdateAccount'"
                ></b-menu-item>
                <b-menu-item
                  icon="file-check"
                  :label="$t('subscription')"
                  tag="router-link"
                  :to="{ name: 'AccountSubscription' }"
                  :active="$route.name === 'AccountSubscription'"
                ></b-menu-item>
              </b-menu-list>
              <b-menu-list
                :label="$t('control_panel')"
                v-if="activeSession && activeSession.role === 'root'"
              >
                <b-menu-item
                  icon="users-alt"
                  :label="$t('accounts')"
                  tag="router-link"
                  :to="{ name: 'ControlPanelAccounts' }"
                  :active="['ControlPanelAccounts', 'ControlPanelUpdateAccount'].includes($route.name)"
                ></b-menu-item>
                <b-menu-item
                  icon="mailbox"
                  :label="$t('events')"
                  tag="router-link"
                  :to="{ name: 'ManageEvents' }"
                  :active="$route.name === 'ManageEvents'"
                ></b-menu-item>
                <b-menu-item
                  icon="setting"
                  :label="$t('platform_settings')"
                  tag="router-link"
                  :to="{ name: 'PlatformSettings' }"
                  :active="$route.name === 'PlatformSettings'"
                ></b-menu-item>
              </b-menu-list>
            </b-menu>
          </div>
          <b-button
            tag="router-link"
            :to="{ name: 'Home' }"
            icon-left="home"
            class="mt-2"
            outlined
            expanded
            >{{ $t('home') }}</b-button
          >
        </div>
        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "@vue/composition-api";
import { rpc } from "@/services/rpc";
import { RPC_GET_ACCOUNT_METHOD } from "@/services/rpc/methods";
import { AccountContract } from "@/services/rpc/contracts/account";
import { avatarFactory } from "@/common/utils";
import { acquireAccount } from "@/store/account";

export default defineComponent({
  setup() {
    const account = ref<AccountContract | null>(null);

    function getAccount() {
      rpc.call(RPC_GET_ACCOUNT_METHOD).then((result) => {
        account.value = result;
      });
    }

    onMounted(() => {
      getAccount();
    });

    return {
      activeSession: acquireAccount().activeSession,
      account,
      avatarFactory,
    };
  },
});
</script>
