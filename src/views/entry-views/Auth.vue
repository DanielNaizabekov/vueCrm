<template>
  <div>
    <EntryForm>
      <form class="auth-form" @submit.prevent="authSubmit">
        <v-text-field
          v-model="auth.email"
          label="email"
          :error-messages="getValidationErrors(authValidations.email)"
        />

        <v-text-field
          v-model="auth.password"
          label="password"
          :error-messages="getValidationErrors(authValidations.password)"
          :append-icon="auth.isShowPassword ? 'visibility' : 'visibility_off'"
          :type="auth.isShowPassword ? 'text' : 'password'"
          @click:append="auth.isShowPassword = !auth.isShowPassword"
        />

        <v-checkbox
          v-model="auth.acceptPolicy"
          label="I accept the privacy policy"
          :error-messages="getValidationErrors(authValidations.acceptPolicy)"
          color="#2A2E37"
          class="mt-2"
        />
      </form>

      <v-scroll-x-transition>
        <div class="auth-error" v-show="auth.errors">{{ auth.errors }}</div>
      </v-scroll-x-transition>

      <span @click="openResetModal" class="auth-forgot-btn">Forgot password ?</span>

      <template #form-action>
        <button @click="toRegister" v-ripple class="form-action-btn left-btn">sign up</button>
        <button
          class="form-action-btn right-btn"
          v-ripple
          :disabled="auth.loading"
          @click="authSubmit"
        >
          <span>sing in</span>
          <overlay v-if="auth.loading">
            <v-progress-circular indeterminate color="#fff"/>
          </overlay>
        </button>
      </template>
    </EntryForm>

    <ResetModal
      v-model="isOpenResetModal"
      :resetErrors="resetErrors"
      :resetLoading="resetLoading"
      @resetPassword="resetPassword"
    />
  </div>
</template>

<script>
import EntryForm from './EntryForm';
import ResetModal from './ResetModal';
import { mapActions } from 'vuex';
import { required, minLength, email } from 'vuelidate/lib/validators';
import { AUTH, SEND_PASSWORD_RESET_EMAIL } from '@/consts';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';
import { authValidations } from '@/utils/validationOptions';

export default {
  components: { EntryForm, ResetModal },
  data() {
    return {
      authValidations,
      auth: {
        email: '',
        password: '',
        acceptPolicy: false,
        isShowPassword: false,
        errors: '',
        loading: false,
      },
      isOpenResetModal: false,
      resetErrors: '',
      resetLoading: false,
    };
  },
  validations: {
    auth: {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      acceptPolicy: { accept: v => v },
    },
  },
  mixins: [prepareErrors],
  methods: {
    ...mapActions({
      signIn: AUTH,
      sendPasswordResetEmail: SEND_PASSWORD_RESET_EMAIL,
    }),
    openResetModal() {
      this.isOpenResetModal = true;
    },
    closeResetModal() {
      this.isOpenResetModal = false;
    },
    toRegister() {
      this.$router.push({ name: 'register' });
    },
    async resetPassword(email) {
      this.resetErrors = '';
      this.resetLoading = true;

      try {
        await this.sendPasswordResetEmail({ body : { email } });
        this.$notification({text: 'Recovery instructions sent to e-mail'})
        this.resetLoading = false;
        this.closeResetModal();
      } catch (e) {
        this.resetErrors = this.getServerErrors(e);
        this.resetLoading = false;
      }
    },
    async authSubmit() {
      this.auth.errors = '';
      if(this.$v.auth.$invalid) return this.$v.auth.$touch();
      this.auth.loading = true;
      
      const body = {
        email: this.auth.email,
        password: this.auth.password,
      };
      try {
        await this.signIn({ body });
        this.$router.push('/');
        this.auth.loading = false;
      } catch (e) {
        this.auth.errors = this.getServerErrors(e);
        this.auth.loading = false;
      }
    },
  },
}
</script>

<style scoped>
.auth-form {
  padding: 0 25px;
}
.auth-error{
  text-align: center;
  color: #ff5252;
  font-size: 12px;
  height: 0;
}
.auth-forgot-btn {
  text-transform:uppercase;
  color:#858585;
  text-align: center;
  display: block;
  margin: 26px 0 16px 0;
  cursor: pointer;
}
</style>