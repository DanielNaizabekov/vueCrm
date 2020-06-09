<template>
  <div class="d-flex align-center">
    <v-avatar tile class="mr-7" color="indigo" min-height="84" min-width="84">
      <img v-if="userData.avatarUrl" :src="userData.avatarUrl" alt="avatar"/>
      <v-icon v-else dark>account_circle</v-icon>
    </v-avatar>

    <div>
      <p class="my-0">{{ userData.name }}</p>
      <v-btn
        class="mt-2 mr-4 text-capitalize"
        color="primary"
        @click="openFilesWindow"
      >
        change avatar
      </v-btn>
      <v-btn
        class="mt-2 text-capitalize"
        color="red" outlined
      >
        remove avatar
      </v-btn>
    </div>

    <input @change="selectAvatar" ref="changeAvatar" id="change-avatar" type="file">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { USER_DATA, UPLOAD_MEDIA, DOWNLOAD_MEDIA, UPDATE_USER_DATA } from '@/consts';
import urls from '@/api/urls';

export default {
  computed: {
    ...mapGetters({
      userData: USER_DATA,
    }),
  },
  methods: {
    ...mapActions({
      uploadMedia: UPLOAD_MEDIA,
      updateUserData: UPDATE_USER_DATA,
    }),
    openFilesWindow() {
      this.$refs.changeAvatar.click();
    },
    buildAvatarUrl(fileName, fileToken) {
      const userId = JSON.parse( localStorage.getItem('currentUserId') );
      return `${urls[DOWNLOAD_MEDIA]}avatar%2F${userId}%2F${fileName}?alt=media&token=${fileToken}`
    },
    selectAvatar(event) {
      const file = event.target.files[0];
      this.uploadMedia({ path: 'avatar', file })
      .then(response => {
        const body = {
          ...this.userData,
          avatarUrl: this.buildAvatarUrl(file.name, response.downloadTokens),
        };
        return this.updateUserData({ body });
      })
      .then(() => this.$notification({ text: 'Avatar updated successfully', color: 'blue-grey lighten-1' }))
      .catch(() => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }))
    },
  },
}
</script>

<style scoped>
#change-avatar {
   opacity: 0;
   user-select: none;
   position: absolute;
   left: -3000px;
   z-index: -100;
}
</style>