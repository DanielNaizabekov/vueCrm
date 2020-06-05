<template>
  <v-app>
    <overlay v-if="loading">
      <v-progress-circular indeterminate color="#fff"/>
    </overlay>

    <div v-if="information" class="information">
      <v-card
        color="#385F73"
        dark
        width="230"
        class="mx-auto"
      >
        <v-card-subtitle>{{ information }}</v-card-subtitle>

        <v-card-actions>
          <v-spacer/>
          <v-btn @click="toHome" text>Home</v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <EntryForm v-else class="reset-form-layout" title="reset password">
      <form class="reset-form">
        <v-text-field
          v-model="password"
          label="new password"
          :error-messages="getValidationErrors(resetPasswordValidations.password)"
          :append-icon="isShowPassword ? 'visibility' : 'visibility_off'"
          :type="isShowPassword ? 'text' : 'password'"
          @click:append="isShowPassword = !isShowPassword"
        />

        <v-text-field
          v-model="repeatPassword"
          label="repeat new password"
          :error-messages="getValidationErrors(resetPasswordValidations.repeatPassword)"
          :append-icon="isShowRepeatPassword ? 'visibility' : 'visibility_off'"
          :type="isShowRepeatPassword ? 'text' : 'password'"
          @click:append="isShowRepeatPassword = !isShowRepeatPassword"
        />
      </form>

      <v-scroll-x-transition>
        <div class="reset-error" v-show="errors">{{ errors }}</div>
      </v-scroll-x-transition>

      <div class="d-flex justify-end pr-6 py-6">
        <v-btn @click="submit" dark color="blue-grey darken-1">Reset</v-btn>
      </div>
    </EntryForm>
  </v-app>
</template>

<script>
import EntryForm from './EntryForm';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { CONFIRM_PASSWORD_RESET } from '@/consts';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';
import { resetPasswordValidations } from '@/utils/validationOptions';

export default {
  components: { EntryForm },
  data() {
    return {
      resetPasswordValidations,
      password: '',
      repeatPassword: '',
      isShowPassword: false,
      isShowRepeatPassword: false,
      errors: '',
      loading: true,
      information: 'Loading...',
    };
  },
  validations: {
    password: { required, minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') },
  },
  mixins: [prepareErrors],
  methods: {
    ...mapActions({
      confirmPasswordReset: CONFIRM_PASSWORD_RESET,
    }),
    toHome() {
      this.$router.push({ name: 'auth' });
    },
    async submit() {
      this.errors = '';
      if(this.$v.$invalid) return this.$v.$touch();
      this.loading = true;

      const body = {
        newPassword: this.password,
        oobCode: this.oobCode,
      };
      try {
        await this.confirmPasswordReset({ body });
        this.loading = false;
        this.information = 'Password changed successfully';
      } catch (e) {
        this.errors = this.getServerErrors(e);
        this.loading = false;
      }
    },
  },
  async mounted() {
    this.oobCode = this.$route.query.oobCode;

    try {
      await this.confirmPasswordReset({ body: { oobCode: this.oobCode } });
      this.loading = false;
      this.information = '';
    } catch (e) {
      this.information = this.getServerErrors(e);
      this.loading = false;
    }
  },
}
</script>

<style scoped>
.information {
  min-height: 100vh;
  background: #2A2E37;
  padding-top: 100px;
  font-family: 'Open Sans', sans-serif;
}
.reset-form {
  padding: 0 25px;
}
.reset-error{
  text-align: center;
  color: #ff5252;
  font-size: 12px;
  height: 0;
}
</style>