<template>
  <div class="columns is-flex is-vcentered is-centered is-desktop" style="height: 100%">
    <div class="column is-4-desktop is-12-mobile is-6-tablet">
      <div class="columns is-multiline mx-2">
        <div class="column is-12">
          <div class="box">
            <b-field label="Login">
              <b-input v-model="name" icon="user" placeholder="Enter your login"></b-input>
            </b-field>
            <b-field label="Email">
              <b-input type="email" icon="envelope" placeholder="Enter your email"></b-input>
            </b-field>
            <b-field label="Select your role">
              <b-radio-button native-value="Base" v-model="role"><b-icon icon="user-square" /> <span>Simple user</span></b-radio-button>
              <b-radio-button native-value="Teacher" v-model="role"><b-icon icon="graduation-cap" /> <span>Teacher</span></b-radio-button>
            </b-field>
            <b-field label="Password">
              <b-input type="password" icon="keyhole-circle" placeholder="Enter your password" password-reveal></b-input>
            </b-field>
            <b-field label="Repeat the password">
              <b-input type="password" icon="keyhole-circle" placeholder="Repeat the password"></b-input>
            </b-field>
            <b-field>
              <b-button type="is-primary" icon-left="plus" @click="showAgreements" expanded>Create an account</b-button>
            </b-field>
          </div>
        </div>
        <div class="column is-12">
          <b-button type="is-light" tag="router-link" to="/" expanded>
            <b-icon icon="angle-left-b" /><span>Go back</span>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class UserRegister extends Vue {
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
