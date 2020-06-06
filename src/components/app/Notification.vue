<template>
  <v-snackbar
    v-model="isOpen"
    :timeout="timeout"
    :color="color"
    top
    right
  >
    {{ text }}
    <v-btn
      v-if="closable"
      text
      @click="isOpen = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { bus } from '@/main';

export default {
  name: 'notification',
  data() {
    return {
      isOpen: false,
      text: 'Notification text',
      color: 'blue-grey lighten-1',
      timeout: 8000,
      closable: true,
    };
  },
  created() {
    bus.$on('openNotification', ({ text, color, timeout, closable }) => {
      this.isOpen = true;
      text && (this.text = text);
      color && (this.color = color);
      timeout && (this.timeout = timeout);
      (closable === false || closable === true) && (this.closable = closable);
    })
  },
}
</script>