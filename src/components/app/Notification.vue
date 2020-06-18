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
      text: '',
      color: '',
      timeout: 0,
      closable: true,
    };
  },
  created() {
    bus.$on('openNotification', ({ text, color, timeout, closable }) => {
      this.isOpen = true;
      this.text = text || 'Notification text';
      this.color = color || 'blue-grey lighten-1';
      this.timeout = timeout || 8000;
      (closable === false || closable === true) && (this.closable = closable);
    })
  },
}
</script>