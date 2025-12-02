<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-12-mobile is-10-tablet is-7-desktop is-5-fullhd">
          <div class="box">
            <form @submit.prevent="authenticate">
              <b-field
                v-if="enterMode === 'username'"
                key="1"
                :label="$t('username')"
              >
                <b-input
                  type="text"
                  :placeholder="$t('username_input_placeholder')"
                  icon="user"
                  :has-counter="false"
                  @icon-click="changeEnterMode"
                  icon-clickable
                  maxlength="18"
                  v-model="usernameOrEmail"
                  required
                />
              </b-field>
              <b-field :label="$t('email')" v-else>
                <b-input
                  type="email"
                  :placeholder="$t('email_input_placeholder')"
                  icon="envelope"
                  :has-counter="false"
                  @icon-click="changeEnterMode"
                  icon-clickable
                  minlength="4"
                  maxlength="40"
                  v-model="usernameOrEmail"
                  required
                />
              </b-field>
              <b-field :label="$t('password')">
                <b-input
                  :placeholder="$t('password_input_placeholder')"
                  type="password"
                  icon="lock"
                  maxlength="18"
                  :has-counter="false"
                  password-reveal
                  v-model="password"
                  required
                />
              </b-field>
              <b-field>
                <captcha
                  ref="captchaRef"
                  @verify="onCaptchaVerify"
                  @expire="onCaptchaExpire"
                  @error="onCaptchaError"
                  :sitekey="captchaSiteKey"
                />
              </b-field>
              <b-button
                native-type="submit"
                type="is-primary"
                icon-right="user-check"
                :disabled="!canSubmit"
                expanded
                >{{ $t("authentication") }}</b-button
              >
            </form>
          </div>
          <div class="is-flex mx-2">
            <b-button
              tag="router-link"
              :to="{ name: 'Home' }"
              icon-left="home"
              expanded
              >{{ $t("home") }}</b-button
            >
            <b-button
              tag="router-link"
              :to="{ name: 'CreateAccount' }"
              class="ml-3"
              icon-left="user-plus"
              expanded
              >{{ $t("create_an_account") }}</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "@vue/composition-api";
import Captcha from "@hcaptcha/vue-hcaptcha";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import { RPC_INVALID_CREDENTIALS_ERR_CODE } from "@/services/rpc/error-codes";
import { RPC_METHOD_ACCOUNT_ENTER } from "@/services/rpc/methods";
import {
  AccountCredentialsContract,
  SessionContract,
} from "@/services/rpc/contracts/account";
import { acquireAccount } from "@/store/account";

export default defineComponent({
  components: { Captcha },
  setup(_, context) {
    const usernameOrEmail = ref<string>("");
    const enterMode = ref<"username" | "email">("username");
    const password = ref<string>("");
    const captcha = ref<string>("");
    const canSubmit = ref<boolean>(false);
    const captchaRef = ref<Captcha>();
    const captchaSiteKey = computed(() => {
      return process.env.VUE_APP_HCAPTCHA_SITEKEY;
    });

    function onCaptchaVerify(response: string) {
      captcha.value = response;
      canSubmit.value = true;
    }

    function onCaptchaExpire() {
      canSubmit.value = false;
    }

    function onCaptchaError() {
      canSubmit.value = false;
    }

    function resetCaptcha() {
      captchaRef.value!.reset();
      canSubmit.value = false;
    }

    function changeEnterMode() {
      enterMode.value = enterMode.value === "username" ? "email" : "username";
    }

    const accounts = acquireAccount();

    function authenticate() {
      const credentials: AccountCredentialsContract = {
        password: password.value,
        captcha: captcha.value,
      };
      credentials[enterMode.value] = usernameOrEmail.value;

      rpc
        .call(RPC_METHOD_ACCOUNT_ENTER, credentials)
        .then(async (session: SessionContract) => {
          await accounts.addSession(session);
          context.root.$router.push({ name: 'AccountSessions' });
          showToastMessage(
            context.root.$i18n.t("successful_authentication_message", {
              username: session.username,
            }) as string,
            ToastType.Success
          );
        })
        .catch((error) => {
          resetCaptcha();
          canSubmit.value = false;
          if (error.jsonrpcError) {
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_INVALID_CREDENTIALS_ERR_CODE) {
              showToastMessage(
                context.root.$i18n.t("invalid_credentials_message") as string,
                ToastType.Danger
              );
            }
          }
        });
    }

    return {
      usernameOrEmail,
      enterMode,
      password,
      captcha,
      canSubmit,
      captchaRef,
      captchaSiteKey,

      onCaptchaVerify,
      onCaptchaExpire,
      onCaptchaError,
      changeEnterMode,
      authenticate,
    };
  },
});
</script>
