<template>
  <v-dialog v-model="value" width="300" persistent>
    <v-card class="reset-password-form">
      <overlay v-if="resetLoading">
        <v-progress-circular indeterminate color="#fff"/>
      </overlay>

      <v-card-title>
        <span class="headline">Reset password</span>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="email"
          label="email"
          :error-messages="getValidationErrors(resetModalValidations.email)"
          hint="Enter account-linked email"
          persistent-hint
        />

        <v-scroll-x-transition>
          <div class="reset-error" v-show="resetErrors">{{ resetErrors }}</div>
        </v-scroll-x-transition>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-grey darken-1" dark small @click="closeModal">Close</v-btn>
        <v-btn color="blue-grey darken-1" dark small @click="submit">Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';
import { resetModalValidations } from '@/utils/validationOptions';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';

export default {
  props: {
    value: {
      type: Boolean,
    },
    resetErrors: {
      type: String,
    },
    resetLoading: {
      type: Boolean,
    },
  },
  data() {
    return {
      resetModalValidations,
      email: '',
      isOpen: false,
    };
  },
  watch: {
    value(v) {
      this.isOpen = v;
    },
    isOpen(v) {
      this.$emit('input', v);
    },
  },
  validations: {
    email: { required, email },
  },
  mixins: [prepareErrors],
  methods: {
    closeModal() {
      this.isOpen = false;
      this.email = '';
    },
    submit() {
      if(this.$v.$invalid) return this.$v.$touch();
      this.$emit('resetPassword', this.email);
    },
  },
}
</script>

<style scoped>
.reset-password-form {
  position: relative;
}
.reset-error{
  text-align: center;
  color: #ff5252;
  font-size: 12px;
  height: 0;
}
</style>