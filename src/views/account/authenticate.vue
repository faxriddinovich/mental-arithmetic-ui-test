<template>
  <div class="is-flex is-centered is-vcentered columns" style="height: 100vh">
    <div class="column is-5-desktop is-12-mobile is-9-tablet">
      <div class="columns is-multiline">
        <div class="column is-12">
          <div class="box mx-2">
            <form @submit.prevent="authenticate">
              <b-field v-if="enterMode === 'username'" key="1" label="Username">
                <b-input
                  type="text"
                  placeholder="Please enter your username"
                  icon="user"
                  :has-counter="false"
                  @icon-click="changeEnterMode"
                  icon-clickable
                  maxlength="18"
                  v-model="usernameOrEmail"
                  required
                />
              </b-field>
              <b-field v-else label="Email address">
                <b-input
                  type="email"
                  placeholder="Please enter your email address"
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
              <b-field
                ><b-checkbox v-model="rememberMe"
                  >Remember me</b-checkbox
                ></b-field
              >
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
                >Authenticate</b-button
              >
            </form>
          </div>
        </div>
        <div class="column is-12-desktop">
          <div class="is-flex mx-3">
            <b-button tag="router-link" to="/" icon-left="home" expanded
              >Home</b-button
            >
            <b-button class="ml-3" icon-left="user-plus" expanded
              >Create an account</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";
import { rpc } from "@/rpc/rpc";
import {
  RPC_INVALID_PARAMS_ERR_CODE,
  RPC_INVALID_CREDENTIALS_ERR_CODE,
} from "@/rpc/error-codes";
import { RPC_AUTHENTICATE_ACCOUNT_METHOD } from "@/rpc/methods";
import { AuthAccountContract } from "@/rpc/contracts/account";
import { Database } from "@/services/indexeddb/database";

@Component({ components: { VueHcaptcha } })
export default class AuthenticateAccount extends Vue {
  public usernameOrEmail = "";
  public enterMode: "username" | "email" = "username";
  public password = "";
  public rememberMe = false;
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

  public async authenticate() {
    const credentials: any = { password: this.password, captcha: this.captcha };
    credentials[this.enterMode] = this.usernameOrEmail;

    rpc
      .call(RPC_AUTHENTICATE_ACCOUNT_METHOD, credentials)
      //FIXME
      .then((account: any) => {
        Database.addSession(account).then(() => {
          this.$buefy.toast.open({
            type: "is-success",
            message: `🎉 Success! Hey <b>${account.username}</b>!`,
          });
        });
      })
      .catch((error) => {
        this.resetHcaptcha();
        if (error.jsonrpcError) {
          const { jsonrpcError } = error;
          if (jsonrpcError.code === RPC_INVALID_PARAMS_ERR_CODE) {
            this.$buefy.toast.open({
              type: "is-danger",
              message: "Invalid parameters",
            });
          } else if (jsonrpcError.code === RPC_INVALID_CREDENTIALS_ERR_CODE) {
            this.$buefy.toast.open({
              type: "is-danger",
              message: "Invalid credentials",
            });
          }
        }
      });
  }

  public changeEnterMode() {
    this.enterMode = this.enterMode === "username" ? "email" : "username";
  }
}
</script>
