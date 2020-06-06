<template>
  <div>
    <EntryForm title="sign up">
      <form class="register-form">
        <v-text-field
          v-model="name"
          label="name"
          :error-messages="getValidationErrors(registerValidations.name)"
        />

        <v-text-field
          v-model="email"
          label="email"
          :error-messages="getValidationErrors(registerValidations.email)"
        />

        <v-text-field
          v-model="password"
          label="password"
          :error-messages="getValidationErrors(registerValidations.password)"
          :append-icon="isShowPassword ? 'visibility' : 'visibility_off'"
          :type="isShowPassword ? 'text' : 'password'"
          @click:append="isShowPassword = !isShowPassword"
        />

        <v-text-field
          v-model="repeatPassword"
          label="repeat password"
          :error-messages="getValidationErrors(registerValidations.repeatPassword)"
          :append-icon="isShowRepeatPassword ? 'visibility' : 'visibility_off'"
          :type="isShowRepeatPassword ? 'text' : 'password'"
          @click:append="isShowRepeatPassword = !isShowRepeatPassword"
        />

        <v-checkbox
          v-model="acceptPolicy"
          label="I accept the privacy policy"
          :error-messages="getValidationErrors(registerValidations.acceptPolicy)"
          color="#2A2E37"
          class="mt-2"
        />
      </form>

      <v-scroll-x-transition>
        <div class="register-error" v-show="errors">{{ errors }}</div>
      </v-scroll-x-transition>

      <div class="divider"></div>

      <template #form-action>
        <button @click="toAuth" v-ripple class="form-action-btn left-btn">sign in</button>
        <button
          class="form-action-btn right-btn"
          v-ripple
          :disabled="loading"
          @click="submit"
        >
          <span>sing up</span>
          <overlay v-if="loading">
            <v-progress-circular indeterminate color="#fff"/>
          </overlay>
        </button>
      </template>
    </EntryForm>
  </div>
</template>

<script>
import EntryForm from './EntryForm';
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';
import { REGISTER } from '@/consts';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';
import { registerValidations } from '@/utils/validationOptions';

export default {
  components: { EntryForm },
  data() {
    return {
      registerValidations,
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      acceptPolicy: false,
      isShowPassword: false,
      isShowRepeatPassword: false,
      errors: '',
      loading: false,
    };
  },
  validations: {
    name: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') },
    acceptPolicy: { accept: v => v },
  },
  mixins: [prepareErrors],
  methods: {
    ...mapActions({
      register: REGISTER,
    }),
    toAuth() {
      this.$router.push({name: 'auth'});
    },
    async submit() {
      this.errors = '';
      if(this.$v.$invalid) return this.$v.$touch();
      this.loading = true;

      const body = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      try {
        await this.register({ body });
        this.$router.push('/');
        this.loading = false;
      } catch (e) {
        this.errors = this.getServerErrors(e);
        this.loading = false;
      }
    },
  },
}
</script>

<style scoped>
.register-form {
  padding: 0 25px;
  margin-bottom: 5px;
}
.register-error{
  text-align: center;
  color: #ff5252;
  font-size: 12px;
  height: 0;
}
.divider {
  height: 20px;
  width: 100%;
  margin-bottom: 13px;
}
</style>