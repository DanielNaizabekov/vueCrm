<template>
  <div class="fill-height">
    <v-navigation-drawer v-model="drawer" app>
      <Sidebar />
      <template #append>
        <v-footer padless>
          <v-col class="copyright text-center">
            <span>© 2020</span>
            <a class="copyright-link" href="https://github.com/DanielNaizabekov" target="_blank">Profile on github</a>
          </v-col>
        </v-footer>
      </template>
    </v-navigation-drawer>

    <Navbar @toggleSidebar="toggleSidebar" />

    <v-content class="content fill-height" :class="{fixed: fixedSection}">
      <div v-if="allowBackBtn" class="backspace-btn" @click="goBack">
        <v-icon x-large>keyboard_backspace</v-icon>
      </div>
      <section class="main-section" :class="{fixed: fixedSection}">
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
  computed: {
    allowBackBtn() {
      return !!this.$route.meta.back;
    },
    fixedSection() {
      return !!this.$route.meta.fixedSection;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
.content.fixed {
  padding-left: 0px !important;
}
.main-section {
  padding: 15px;
  /* min-height: 100%;
  height: 1px; */
}
.main-section.fixed {
  padding: 0;
}
.backspace-btn {
  display: inline-block;
  margin: 6px 0 -9px 15px;
}
.backspace-btn:hover i {
  color: #000;
}
.backspace-btn:active {
  transform: translateX(-2px);
}
.copyright {
  font-size: 12px;
}
.copyright-link {
  margin-left: 5px;
  color: #586069;
  text-decoration: none;
}
.copyright-link:hover {
  text-decoration: underline;
}
</style>

<style>
.v-navigation-drawer {
  height: 100% !important;
}
</style>