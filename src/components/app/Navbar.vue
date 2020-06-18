<template>
  <v-app-bar dark app>
    <v-app-bar-nav-icon @click.stop="toggleSidebar"/>
    <v-toolbar-title>Application</v-toolbar-title>

    <v-spacer/>

    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn
          href="https://github.com/DanielNaizabekov/vueCrm"
          icon
          large
          target="_blank"
          v-on="on"
          class="mr-2"
        >
          <v-icon>code</v-icon>
        </v-btn>
      </template>
      <span>Source</span>
    </v-tooltip>

    <transition-card v-model="isAvatarOpen">
      <template #activator>
        <v-btn @click.stop="onAvatarOpen" icon>
          <v-avatar size="36" color="indigo">
            <img v-if="avatarUrl" :src="avatarUrl" alt="avatar"/>
            <v-icon v-else dark>account_circle</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-card light min-width="150" class="mx-auto">
        <v-card-title class="profile-title-wrapper font-weight-regular pt-2 pb-1 px-5">
          <div
            :style="`background: url(${avatarUrl}) center / cover`"
            class="profile-title-img"
          />
          <div class="profile-title mx-auto">{{ userData.name }}</div>
        </v-card-title>

        <v-list nav dense>
          <v-list-item @click="toProfile" link>
            <v-icon class="mr-3">perm_identity</v-icon>
            <v-list-item-title class="subtitle-2 font-weight-bold"> Profile </v-list-item-title>
          </v-list-item>

          <v-list-item link>
            <transition-card class="exit-confirm-wrapper" v-model="isExitConfirmOpen">
              <template #activator>
                <div @click.stop="onExitConfirmOpen" class="exit-confirm-activator d-flex">
                  <v-icon class="mr-3">exit_to_app</v-icon>
                  <v-list-item-title class="subtitle-2 font-weight-bold"> Exit </v-list-item-title>
                </div>
              </template>

              <v-card min-width="200">
                <v-card-title class="body-1">
                  Are you sure you want to exit?
                </v-card-title>
                <v-card-actions class="d-flex justify-space-around">
                  <v-btn
                    class="mr-2"
                    color="primary"
                    text
                    small
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="red"
                    text
                    small
                    @click="logout"
                  >
                    Exit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </transition-card>
          </v-list-item>
        </v-list>
      </v-card>
    </transition-card>
  </v-app-bar>
</template>

<script>
import { LOGOUT } from '@/consts';
import TransitionCard from './TransitionCard';
import { USER_DATA, DOWNLOAD_MEDIA } from '@/consts';
import urls from '@/api/urls';

export default {
  components: {
    TransitionCard,
  },
  data() {
    return {
      isAvatarOpen: false,
      isExitConfirmOpen: false,
    };
  },
  computed: {
    userData() {
      return this.$store.getters[USER_DATA];
    },
    avatarUrl() {
      const userId = JSON.parse( localStorage.getItem('currentUserId') );
      return this.userData.avatar
      ? `${urls[DOWNLOAD_MEDIA]}avatars%2F${userId}%2F${this.userData.avatar.fileName}?alt=media&token=${this.userData.avatar.fileToken}`
      : false;
    },
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
    onExitConfirmOpen() {
      this.isExitConfirmOpen = true;
    },
    logout() {
      this.$store.commit(LOGOUT);
      this.$router.push({name: 'auth'});
    },
  },
  mounted() {
    this.$store.dispatch(USER_DATA)
    .catch(() => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }));
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
.exit-confirm-wrapper,
.exit-confirm-activator {
  width: 100%;
  height: 100%;
}
</style>