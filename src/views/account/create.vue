<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="columns is-gapless is-centered" style="min-width: 100%">
        <div class="column is-12-mobile is-10-tablet is-7-desktop is-5-fullhd">
          <div class="box">
            <form @submit.prevent="createAccount">
              <b-field :label="$t('username')">
                <b-input
                  type="text"
                  :placeholder="$t('username_input_placeholder')"
                  icon="user"
                  maxlength="18"
                  :has-counter="false"
                  v-model="username"
                  required
                />
              </b-field>
              <b-field :label="$t('email')">
                <b-input
                  type="email"
                  :placeholder="$t('email_input_placeholder')"
                  icon="envelope"
                  :has-counter="false"
                  minlength="4"
                  maxlength="40"
                  v-model="email"
                />
              </b-field>
              <b-field :label="$t('role')">
                <b-select v-model="role">
                  <option value="default">{{ $t("roles.default") }}</option>
                  <option value="teacher">{{ $t("roles.teacher") }}</option>
                </b-select>
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
                icon-right="plus"
                :disabled="!canSubmit"
                expanded
                >{{ $t("create_an_account") }}</b-button
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
              :to="{ name: 'Authenticate' }"
              class="ml-3"
              icon-left="user-check"
              expanded
              >{{ $t("authentication") }}</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "@vue/composition-api";
import Captcha from "@hcaptcha/vue-hcaptcha";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import { RPC_METHOD_ACCOUNT_CREATE } from "@/services/rpc/methods";
import { RPC_ACCOUNT_ALREADY_EXISTS_ERR_CODE } from "@/services/rpc/error-codes";
import { CreateAccountContract } from "@/services/rpc/contracts/account";

export default defineComponent({
  components: { Captcha },
  setup(_, context) {
    const username = ref<string>("");
    const email = ref<string>("");
    const enterMode = ref<"username" | "email">("username");
    const password = ref<string>("");
    const captcha = ref<string>("");
    const role = ref<string>("default");
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

    function createAccount() {
      const params: CreateAccountContract = {
        username: username.value,
        role: role.value,
        password: password.value,
        captcha: captcha.value,
      };
      if (email.value.length) params["email"] = email.value;
      console.log(params);

      rpc
        .call(RPC_METHOD_ACCOUNT_CREATE, params)
        .then(() => {
          showToastMessage(
            context.root.$t("success_account_creation_message") as string,
            ToastType.Success
          );
          context.root.$router.push({ name: "Authenticate" });
        })
        .catch((error) => {
          console.log(error);
          if (error.jsonrpcError) {
            resetCaptcha();
            const { jsonrpcError } = error;
            if (jsonrpcError.code === RPC_ACCOUNT_ALREADY_EXISTS_ERR_CODE) {
              showToastMessage(
                context.root.$t(
                  "account_already_exists_error_message"
                ) as string,
                ToastType.Danger
              );
              return;
            }
          }
        });

      console.log(1);
    }

    return {
      username,
      email,
      role,
      enterMode,
      password,
      captcha,
      canSubmit,
      captchaRef,
      captchaSiteKey,
      onCaptchaVerify,
      onCaptchaExpire,
      onCaptchaError,
      createAccount,
    };
  },
});
</script>
