<template>
  <c-box w="100%" mx="auto" maxW="70ch" px="1rem">
    <c-flex align-items="center" height="100vh">
      <c-box
        bg="white"
        border-width="2px"
        border-color="gray.300"
        rounded="md"
        boxShadow="lg"
        p="4"
        width="100%"
      >
        <form @submit.prevent="formSubmit">
          <c-stack>
            <c-form-control is-required>
              <c-form-label for="email"
                >Username or email address:</c-form-label
              >
              <c-input-group>
                <c-input-left-element>
                  <unicon name="user" width="20" />
                </c-input-left-element>
                <c-input
                  type="text"
                  id="email"
                  placeholder="Please enter your username or email address"
                  minLength="4"
                  maxLength="20"
                  v-model="login"
                />
              </c-input-group>
            </c-form-control>
            <c-form-control is-required>
              <c-form-label for="password">Your password:</c-form-label>
              <c-input-group>
                <c-input-left-element>
                  <unicon name="keyhole-circle" width="20" />
                </c-input-left-element>
                <c-input
                  type="password"
                  id="password"
                  placeholder="Please enter your password"
                  minLength="4"
                  maxLength="20"
                  v-model="password"
                />
              </c-input-group>
            </c-form-control>
            <c-checkbox v-model="remember" variant-color="gray"
              >Remember me</c-checkbox
            >
            <c-box overflow="hidden">
              <vue-hcaptcha
                :sitekey="hcaptchaSiteKey"
                ref="captcha"
                @verify="onVerify"
                @expire="onExpire"
                @error="onError"
              />
            </c-box>
          </c-stack>
          <c-box mt="4">
            <c-button type="submit" w="100%" :is-disabled="!verified">
              <unicon name="user-check" width="20" />
              &nbsp;&nbsp;Login</c-button
            >
          </c-box>
        </form>
      </c-box>
    </c-flex>
  </c-box>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  CBox,
  CFlex,
  CFormControl,
  CFormLabel,
  CInput,
  CStack,
  CButton,
  CCheckbox,
  CIcon,
  CInputLeftElement,
  CInputGroup,
} from "@chakra-ui/vue";
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";
import { rpc } from "@/rpc/rpc";
import { RPC_ERR_INVALID_CREDENTIALS_CODE } from "@/rpc/error-codes";
import { RPC_USER_LOGIN_METHOD } from "@/rpc/methods";

@Component({
  components: {
    CBox,
    CFlex,
    CFormControl,
    CFormLabel,
    CInput,
    CInputGroup,
    CStack,
    CButton,
    CCheckbox,
    CIcon,
    CInputLeftElement,
    VueHcaptcha,
  },
})
export default class UserLogin extends Vue {
  public login = "";
  public password = "";
  public captcha = "";
  public remember = false;
  public verified = false;
  public isLoading = false;

  public $toast!: any;
  public $refs!: {
    captcha: VueHcaptcha;
  };

  get hcaptchaSiteKey(): string {
    return process.env.VUE_APP_HCAPTCHA_SITEKEY;
  }

  public onVerify(response: string): void {
    this.captcha = response;
    this.verified = true;
  }

  public onExpire(): void {
    this.verified = false;
  }

  public onError(): void {
    this.verified = false;
  }

  public async formSubmit(): Promise<void> {
    const { login, password, captcha } = this;

    try {
      const session = await rpc.call(RPC_USER_LOGIN_METHOD, {
        login,
        password,
        captcha,
      });
      alert(session);
    } catch (error) {
      this.$refs.captcha.reset();
      this.verified = false;
      if (error.jsonrpcError) {
        const { jsonrpcError } = error;
        if (jsonrpcError.code === RPC_ERR_INVALID_CREDENTIALS_CODE) {
          return this.$toast({
            title: "Invalid credentials",
            status: "warning",
            position: "top",
            variant: "top-accent",
            isClosable: false,
          });
        }
      }
      this.$router.push({ name: "Panic", params: { error }});
    }
  }
}
</script>
