<template>
  <v-app-bar dark app>
    <v-app-bar-nav-icon @click.stop="toggleSidebar"></v-app-bar-nav-icon>
    <v-toolbar-title>Application</v-toolbar-title>

    <v-spacer></v-spacer>

    <transition-card v-model="isAvatarOpen">
      <template #activator>
        <v-btn @click.stop="onAvatarOpen" icon>
          <v-avatar size="36" color="indigo">
            <!-- <v-icon>account_circle</v-icon> -->
            <img
              src="https://cdn.vuetifyjs.com/images/lists/ali.png"
              alt="photo"
            >
          </v-avatar>
        </v-btn>
      </template>

      <v-card light min-width="150" class="mx-auto">
        <v-card-title class="profile-title-wrapper font-weight-regular pt-2 pb-1 px-5">
          <div
            style="background: url('https://cdn.vuetifyjs.com/images/lists/ali.png') center / cover"
            class="profile-title-img"
          />
          <div class="profile-title mx-auto">{{ userName }}</div>
        </v-card-title>

        <v-list nav dense>
          <v-list-item @click="toProfile" link>
            <v-icon class="mr-3">perm_identity</v-icon>
            <v-list-item-title class="subtitle-2 font-weight-bold"> Profile </v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout" link>
            <v-icon class="mr-3">exit_to_app</v-icon>
            <v-list-item-title class="subtitle-2 font-weight-bold"> Exit </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </transition-card>

  </v-app-bar>
</template>

<script>
import { LOGOUT } from '@/consts';
import TransitionCard from './TransitionCard';

export default {
  components: {
    TransitionCard,
  },
  props: {
    userName: {
      type: String,
    },
  },
  data() {
    return {
      isAvatarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggleSidebar');
    },
    onAvatarOpen() {
      this.isAvatarOpen = true;
    },
    toProfile() {
      this.$router.push({ name: 'profile' });
    },
    logout() {
      this.$store.commit(LOGOUT);
      this.$router.push({name: 'auth'});
    },
  },
}
</script>

<style scoped>
.profile-title-wrapper {
  position: relative;
}
.profile-title-img {
  left: 0; top: 0; right: 0; bottom: 0;
  position: absolute;
  z-index: 0;
  filter: blur(1px);
  opacity: 0.5;
}
.profile-title {
  position: relative;
  z-index: 5;
  text-shadow: 0px 0px 8px #fff;
}
</style>