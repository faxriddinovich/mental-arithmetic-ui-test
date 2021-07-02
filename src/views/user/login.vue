<template>
  <div class="is-flex is-justify-content-center" style="height: 100vh">
    <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <div class="box">
        <section>
          <b-field label="Login">
            <b-input v-model="name" icon="user" placeholder="Enter your login"></b-input>
          </b-field>

          <b-field label="Email">
            <b-input type="email" icon="envelope" placeholder="Enter your email"></b-input>
          </b-field>

          <b-field label="Select your role">
            <b-radio-button native-value="Base" v-model="role"><b-icon icon="user-square" /> <span>Base</span></b-radio-button>
            <b-radio-button native-value="Teacher" v-model="role"><b-icon icon="graduation-cap" /> <span>Teacher</span></b-radio-button>
          </b-field>

          <b-field label="Password">
            <b-input type="password" icon="keyhole-circle" placeholder="Enter your password"  password-reveal></b-input>
          </b-field>

          <b-field label="Repeat the password">
            <b-input type="password" icon="keyhole-circle" placeholder="Repeat the password"  password-reveal></b-input>
          </b-field>
          <b-field>
            <b-button type="is-primary" icon-left="plus-circle" @click="showAgreements" expanded>Register</b-button>
          </b-field>
          <b-field>
            <b-button type="is-primary" tag="router-link" to="/" expanded inverted>
              <b-icon icon="angle-left-b" /><span>Go back</span>
            </b-button>
          </b-field>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class UserLogin extends Vue {
  public role: string = "Base";

  public showAgreements() {
    this.$buefy.dialog.confirm({
      title: 'Agreements',
      message: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Fusce id fermentum quam. Proin sagittis,
        nibh id hendrerit imperdiet, elit sapien laoreet elit,
        ac scelerisque diam velit in nisl. Nunc maximus ex non
        laoreet semper. Nunc scelerisque, libero sit amet pretium dignissim,
        augue purus placerat justo,
      `,
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      hasIcon: true,
      icon: 'exclamation-circle',
      size: 'is-small'
    });
  }
}
</script>
