<template>
  <section>
    <div
      class="columns is-flex is-vcentered is-centered is-desktop"
      style="height: 100vh"
    >
      <div class="column is-6-desktop is-12-mobile is-8-tablet">
        <div class="columns is-multiline mx-2">
          <div class="column is-12">
            <div class="box">
              <b-field label="Username">
                <b-input
                  placeholder="Please write your username"
                  icon="user"
                  maxlength="30"
                  required
                />
              </b-field>
              <b-field label="Email">
                <b-input
                  type="email"
                  placeholder="Please write your email address"
                  icon="envelope-alt"
                  maxLength="30"
                />
              </b-field>

              <b-field label="Select your role">
                <b-radio v-model="role" native-value="user">
                  I'm a simple user
                </b-radio>
                <b-radio v-model="role" native-value="teacher">
                  I'm a teacher
                </b-radio>
              </b-field>

              <b-field label="Password">
                <b-input type="password" icon="keyhole-circle" password-reveal> </b-input>
              </b-field>
              <b-field label="Repeat the password">
                <b-input type="password" icon="keyhole-circle" password-reveal>
                </b-input>
              </b-field>
              <b-field>
                <b-checkbox
                  >I agree to the
                  <a href="#">Terms and Conditions</a></b-checkbox
                >
              </b-field>
              <b-field>
                <b-button type="is-primary" icon-left="user-plus" expanded
                  >Create an account</b-button
                >
              </b-field>
            </div>
            <div class="column is-12">
              <b-button type="is-ghost" icon-left="arrow-left" expanded
                >Go back</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  @Prop() public role: "user" | "teacher" = "user";
}
</script>
