<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <Sidebar />
    </v-navigation-drawer>

    <Navbar :userName="userData.name" @toggleSidebar="toggleSidebar" />

    <v-content>
      <section class="main-section">
        <router-view/>
      </section>
    </v-content>
  </v-app>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default {
  components: {
    Sidebar,
    Navbar,
  },
  data() {
    return {
      drawer: false,
      userData: {},
    };
  },
  methods: {
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  },
  mounted() {
    this.$store.dispatch('USER_DATA')
      .then(response => Object.keys(response).forEach(key => this.userData = response[key]));
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