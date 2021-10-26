<template>
  <div
    class="columns is-centered is-vcentered is-mobile m-0"
    style="height: 100vh"
  >
    <div class="column is-5-desktop is-12-mobile is-9-tablet">
      <div class="box">
        <form @submit.prevent="createAccount">
          <b-field label="Username">
            <b-input
              type="text"
              placeholder="Please enter your username"
              icon="user"
              maxlength="18"
              :has-counter="false"
              v-model="username"
              required
            />
          </b-field>
          <b-field label="Email address">
            <b-input
              type="email"
              placeholder="Please enter your email address"
              icon="envelope"
              :has-counter="false"
              minlength="4"
              maxlength="40"
              v-model="email"
            />
          </b-field>
          <b-field label="Role">
            <b-select placeholder="Select a role" v-model="role">
              <option value="default">default</option>
              <option value="teacher">teacher</option>
            </b-select>
          </b-field>
          <b-field label="Password">
            <b-input
              placeholder="Please enter your password"
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
            icon-right="plus"
            :disabled="!canSubmit"
            expanded
            >Create</b-button
          >
        </form>
      </div>
      <div class="is-flex mx-2">
        <b-button
          tag="router-link"
          :to="{ name: 'Home' }"
          icon-left="home"
          expanded
          >Home</b-button
        >
        <b-button
          tag="router-link"
          :to="{ name: 'Authenticate' }"
          class="ml-3"
          icon-left="user-check"
          expanded
          >Authenticate</b-button
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
import { RPC_CREATE_ACCOUNT_METHOD } from "@/services/rpc/methods";
import { RPC_ACCOUNT_ALREADY_EXISTS_ERR_CODE } from "@/services/rpc/error-codes";

@Component({ components: { VueHcaptcha } })
export default class AuthenticateAccount extends Vue {
  public username = "";
  public email = "";
  public role = "default";
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

  public onCaptchaExpire(response: string) {
    this.canSubmit = false;
  }

  public onCaptchaError(response: string) {
    this.canSubmit = false;
  }

  public resetHcaptcha() {
    this.$refs.captcha.reset();
    this.canSubmit = false;
  }

  // FIXME: fix typescript types
  public createAccount() {
    const params = {
      username: this.username,
      role: this.role,
      password: this.password,
      captcha: this.captcha,
    };
    if (this.email.length) params["email"] = this.email;

    rpc
      .call(RPC_CREATE_ACCOUNT_METHOD, params)
      .then((account) => {
        showToastMessage(
          `Success! Welcome <b>${account.username}</b>!`,
          ToastType.Success
        );
        this.$router.push({ name: "Authenticate" });
      })
      .catch((error) => {
        if (error.jsonrpcError) {
          this.resetHcaptcha();
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_ACCOUNT_ALREADY_EXISTS_ERR_CODE) {
            showToastMessage("Account already exists", ToastType.Danger);
            return;
          }
        }
        showToastMessage("Something went wrong", ToastType.Danger);
      });
  }
}
</script>
