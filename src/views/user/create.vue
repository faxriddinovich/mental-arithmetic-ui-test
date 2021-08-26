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
              <c-form-label for="username">Username</c-form-label>
              <c-input-group>
                <c-input-left-element>
                  <unicon name="user" width="20" />
                </c-input-left-element>
                <c-input
                  type="text"
                  id="username"
                  minLength="4"
                  maxLength="20"
                  placeholder="For example: piececandyearth"
                  v-model="username"
                />
              </c-input-group>
              <c-form-helper-text>Username must be unique</c-form-helper-text>
            </c-form-control>
            <c-form-control>
              <c-form-label for="email">Email address:</c-form-label>
              <c-input-group>
                <c-input-left-element>
                  <unicon name="envelope" width="20" />
                </c-input-left-element>
                <c-input
                  type="email"
                  id="email"
                  placeholder="For example: piececandyearth@example.com"
                  v-model="email"
                />
              </c-input-group>
            </c-form-control>
            <c-form-control is-required>
              <c-form-label>Select your role:</c-form-label>
              <c-radio-group is-inline v-model="role">
                <c-radio value="user">Simple user</c-radio>
                <c-radio value="teacher">Teacher</c-radio>
              </c-radio-group>
              <c-form-helper-text>
                If you select "Teacher" you will able to use features such as:
                Create a course etc.
              </c-form-helper-text>
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
              <c-form-helper-text>
                We recommend to write a strong password for you safety. Please
                do not write passwords such as: 1234.., qwerty.. etc.
              </c-form-helper-text>
            </c-form-control>
            <c-input-group is-required>
              <c-checkbox v-model="agreement">
                I agree to the
                <c-link href="https://vue.chakra-ui.com" as="b" color="indigo">
                  Terms of Service
                  <unicon name="external-link-alt" width="15" height="15"
                /></c-link>
              </c-checkbox>
            </c-input-group>
            <c-box overflow="hidden">
              <vue-hcaptcha
                :sitekey="hcaptchaSiteKey"
                ref="captcha"
                @verify="onVerify"
                @expire="onExpire"
                @error="onError"
              />
            </c-box>
            <c-box mt="4">
              <c-button
                type="submit"
                w="100%"
                :is-disabled="!verified || !agreement"
              >
                <unicon name="user-plus" width="20" />
                &nbsp;&nbsp;Create</c-button
              >
            </c-box>
          </c-stack>
        </form>
      </c-box>
    </c-flex>
  </c-box>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
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
  CFormHelperText,
  CRadioGroup,
  CRadio,
  CLink,
} from "@chakra-ui/vue";
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";
import { rpc } from "@/rpc/rpc";
import { RPC_CREATE_USER_METHOD } from "@/rpc/methods";
import { RPC_ERR_USER_ALREADY_EXISTS_CODE } from "@/rpc/error-codes";

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
    CFormHelperText,
    CRadioGroup,
    CRadio,
    CLink,
    VueHcaptcha,
  },
})
export default class UserLogin extends Vue {
  public username = "";
  public email = "";
  public password = "";
  public role: "user" | "teacher" = "user";
  public verified = false;
  public captcha = "";
  public agreement = false;

  public $toast!: any;
  public $refs!: {
    captcha: VueHcaptcha;
  };

  get hcaptchaSiteKey(): string {
    return process.env.VUE_APP_HCAPTCHA_SITEKEY;
  }

  public async formSubmit(): Promise<void> {
    try {
      const { username, email, password, role, captcha } = this;
      await rpc.call(RPC_CREATE_USER_METHOD, {
        username,
        email: email.length ? email : undefined,
        password,
        role,
        captcha,
      });
    } catch (error) {
      this.$refs.captcha.reset();
      this.verified = false;
      if (error.jsonrpcError) {
        const { jsonrpcError } = error;
        if (jsonrpcError.code === RPC_ERR_USER_ALREADY_EXISTS_CODE) {
          this.$toast({
            title: "User already exists",
            status: "warning",
            position: "top",
            variant: "top-accent",
            isClosable: false,
          });
        }
      }
    }
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
}
</script>
