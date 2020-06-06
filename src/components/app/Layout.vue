<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <Sidebar />
    </v-navigation-drawer>

    <Navbar @toggleSidebar="toggleSidebar" />

    <v-content>
      <section class="main-section">
        <router-view/>
      </section>
    </v-content>
  </div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default {
  components: {
    Sidebar,
    Navbar,
  },
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
.main-section {
  padding: 15px;
  min-height: 100%;
  height: 1px;
}
</style>