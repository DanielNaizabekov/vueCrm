<template>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeout"
    top
    right
  >
    {{ text }}
    <v-btn
      v-if="closable"
      color="blue"
      text
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'notification',
  props: {
    value: {
      type: Boolean,
    },
    text: {
      type: String,
      default: 'Notification text',
    },
    closable: {
      type: Boolean,
      default: true,
    },
    timeout: {
      type: Number,
      default: 8000,
    },
  },
  data() {
    return {
      snackbar: null,
    };
  },
  watch: {
    value(v) {
      this.snackbar = v;
    },
    snackbar(v) {
      this.$emit('input', v);
    },
  },
}
</script>