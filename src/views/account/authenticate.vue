<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-desktop is-12-mobile is-9-tablet">
      <div class="box">
        <form @submit.prevent="authenticate">
          <b-field
            v-if="enterMode === 'username'"
            key="1"
            :label="$t('username')"
          >
            <b-input
              type="text"
              :placeholder="$t('username-input-placeholder')"
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
              :placeholder="$t('email-input-placeholder')"
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
              :placeholder="$t('password-input-placeholder')"
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
            <vue-hcaptcha
              ref="captcha"
              @verify="onCaptchaVerify"
              @expire="onCaptchaExpire"
              @error="onCaptchaError"
              :sitekey="hcaptchaSiteKey"
            />
          </b-field>
          <b-button
            native-type="submit"
            type="is-primary"
            icon-right="user-check"
            :disabled="!canSubmit"
            expanded
            >{{ $t("authenticate") }}</b-button
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
          >{{ $t("create-account") }}</b-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";
import { showToastMessage, ToastType } from "@/services/toast";
import { rpc } from "@/services/rpc";
import {
  RPC_INVALID_CREDENTIALS_ERR_CODE
} from "@/services/rpc/error-codes";
import { RPC_AUTHENTICATE_ACCOUNT_METHOD } from "@/services/rpc/methods";
import { SessionStorage } from "@/services/storages/session";
import {
  AccountCredentialsContract,
  SessionContract,
} from "@/services/rpc/contracts/account";

@Component({ components: { VueHcaptcha } })
export default class AuthenticateAccount extends Vue {
  public usernameOrEmail = "";
  public enterMode: "username" | "email" = "username";
  public password = "";
  public captcha = "";
  public canSubmit = false;

  public $refs!: {
    captcha: VueHcaptcha;
  };

  get hcaptchaSiteKey() {
    return process.env.VUE_APP_HCAPTCHA_SITEKEY;
  }

  public onCaptchaVerify(response: string) {
    this.captcha = response;
    this.canSubmit = true;
  }

  public onCaptchaExpire() {
    this.canSubmit = false;
  }

  public onCaptchaError() {
    this.canSubmit = false;
  }

  public resetCaptcha() {
    this.$refs.captcha.reset();
    this.canSubmit = false;
  }

  public authenticate() {
    const credentials: AccountCredentialsContract = {
      password: this.password,
      captcha: this.captcha,
    };
    credentials[this.enterMode] = this.usernameOrEmail;

    rpc
      .call(RPC_AUTHENTICATE_ACCOUNT_METHOD, credentials)
      .then((session: SessionContract) => {
        SessionStorage.addSession(session);
        showToastMessage(
          this.$i18n.t("success-authentication", {
            username: session.username,
          }) as string,
          ToastType.Success
        );
      })
      .catch((error) => {
        this.resetCaptcha();
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_INVALID_CREDENTIALS_ERR_CODE) {
            showToastMessage(
              this.$i18n.t("invalid-credentials") as string,
              ToastType.Danger
            );
          }
          // handle other errors
        }
      });
  }

  public changeEnterMode() {
    this.enterMode = this.enterMode === "username" ? "email" : "username";
  }
}
</script>
