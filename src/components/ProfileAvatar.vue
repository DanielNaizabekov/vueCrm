<template>
  <div class="d-flex align-center">
    <v-avatar tile class="mr-7" color="indigo" min-height="84" min-width="84">
      <overlay v-if="changeAvatarLoading">
        <v-progress-circular
          :value="uploadProgress"
          size="50"
          width="3"
          color="#fff">
          {{ uploadProgress }}
        </v-progress-circular>
      </overlay>
      <overlay v-if="removeAvatarLoading">
        <v-progress-circular indeterminate color="#fff"/>
      </overlay>
      <img class="profile-avatar" v-if="avatarUrl" :src="avatarUrl" alt="avatar"/>
      <v-icon v-else dark>account_circle</v-icon>
    </v-avatar>

    <div>
      <p class="my-0">{{ userData.name }}</p>
      <v-btn
        class="mr-4 text-capitalize"
        color="primary"
        @click="openFilesWindow"
      >
        change avatar
      </v-btn>
      <transition-card v-model="isOpenRemoveConfirm">
        <template #activator>
          <v-btn
            class="mt-2 text-capitalize"
            color="red"
            outlined
            @click.stop="onOpenRemoveConfirm"
          >
            remove avatar
          </v-btn>
        </template>

        <v-card min-width="200">
          <v-card-title class="body-1">
            Are you sure you want to delete?
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
              @click="removeAvatar"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
      </transition-card>
    </div>

    <input @change="selectAvatar" ref="changeAvatar" id="change-avatar" type="file">
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { USER_DATA, UPLOAD_MEDIA, DOWNLOAD_MEDIA, DELETE_MEDIA, UPDATE_USER_DATA } from '@/consts';
import urls from '@/api/urls';
import TransitionCard from './app/TransitionCard';

export default {
  components: { TransitionCard },
  data() {
    return {
      changeAvatarLoading: false,
      removeAvatarLoading: false,
      isOpenRemoveConfirm: false,
    };
  },
  computed: {
    ...mapGetters({
      userData: USER_DATA,
      uploadProgress: 'getUploadProgress',
    }),
    avatarUrl() {
      const userId = JSON.parse( localStorage.getItem('currentUserId') );
      return this.userData.avatar
      ? `${urls[DOWNLOAD_MEDIA]}avatars%2F${userId}%2F${this.userData.avatar.fileName}?alt=media&token=${this.userData.avatar.fileToken}`
      : false;
    },
  },
  methods: {
    ...mapActions({
      uploadMedia: UPLOAD_MEDIA,
      deleteMedia: DELETE_MEDIA,
      updateUserData: UPDATE_USER_DATA,
    }),
    ...mapMutations({
      resetUploadProgress: UPLOAD_MEDIA,
    }),
    openFilesWindow() {
      this.$refs.changeAvatar.click();
    },
    buildAvatarStoragePath(fileName) {
      const userId = JSON.parse( localStorage.getItem('currentUserId') );
      return `avatars/${userId}/${fileName}`;
    },
    selectAvatar(event) {
      if (!event.target.files[0]) return;
      this.changeAvatarLoading = true;

      const file = event.target.files[0];
      this.uploadMedia({ path: this.buildAvatarStoragePath(file.name), file })
      .then(({ data }) => {
        const body = {
          ...this.userData,
          avatar: {
            fileName: file.name,
            fileToken: data.downloadTokens,
          },
        };
        return this.updateUserData({ body });
      })
      .then(() => this.$notification({ text: 'Avatar updated successfully', color: 'blue-grey lighten-1' }))
      .catch(() => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }))
      .finally(() => {
        this.changeAvatarLoading = false;
        this.resetUploadProgress(0);
      });
    },
    onOpenRemoveConfirm() {
      if (!this.userData.avatar) return;
      this.isOpenRemoveConfirm = true;
    },
    removeAvatar() {
      this.removeAvatarLoading = true;

      this.deleteMedia({ path: this.buildAvatarStoragePath(this.userData.avatar.fileName) })
      .then(() => {
        let userData = {...this.userData};
        delete userData.avatar;
        return this.updateUserData({ body: {...userData} });
      })
      .catch(() => this.$notification({ text: 'Avatar removing failed', color: 'red lighten-2' }))
      .finally(() => this.removeAvatarLoading = false);
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

.profile-avatar {
  width: 100%;
  height: 100%;
}
</style>