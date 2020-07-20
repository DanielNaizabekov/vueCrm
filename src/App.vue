<template>
  <div id="app">
    <v-app>
      <router-view/>

      <notification/>
    </v-app>
  </div>
</template>

<script>
import Notification from '@/components/app/Notification';

export default {
  components: { Notification },
  name: 'App',
};
</script>

<style>
html, body, #app, .v-application {
  height: 100% !important;
}
.v-application--wrap {
  min-height: auto !important;
}
</style>