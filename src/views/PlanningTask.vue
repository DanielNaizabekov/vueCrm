<template>
  <overlay class="planning-task-page">
    <v-card width="700" class="pa-3">
      <v-row class="ma-0 mb-3 align-center">
        <p class="planning-task-id ma-0">{{ params.taskId }}</p>

        <v-spacer/>

        <v-btn
          @click="copyLink"
          icon
          color="#42526E"
          class="ml-2"
        >
          <v-icon>content_copy</v-icon>
        </v-btn>

        <TransitionCard v-model="isOpenDeleteConfirm">
          <template #activator>
            <v-btn
              @click.stop="onOpenDeleteConfirm"
              icon
              color="#42526E"
              class="ml-2"
            >
              <v-icon>delete_forever</v-icon>
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
                @click="onDeleteTask"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </TransitionCard>

        <v-btn
          @click="closeTask"
          icon
          color="#42526E"
          class="ml-2"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-row>

      <v-sheet v-if="pageLoading" color="grey lighten-4" class="pa-1">
        <v-skeleton-loader type="article"/>
      </v-sheet>

      <div v-else class="d-flex flex-wrap">
        <div class="col-12 col-sm mb-5 mb-sm-0 pa-0 mr-5">
          <PlanningBoardInput
            v-model="isOpenTitleInput"
            class="planning-task-title-input"
            :inputValueProp="task.title"
            @submit="changeTitle"
          />
          <div
            v-if="!isOpenTitleInput"
            class="planning-task-title-btn"
            @click.stop="onOpenTitleInput"
          >
            <v-icon size="21" class="planning-task-title-icon">create</v-icon>
            <span class="ml-2">{{ task.title }}</span>
          </div>

          <div>
            <v-textarea
              v-model="taskDescription"
              class="mt-3"
              solo
              label="Description"
            />
            <div class="d-flex mt-n4">
              <v-spacer/>
              <v-btn
                @click="resetDescription"
                class="text-capitalize mr-2"
                outlined
                :disabled="isDescriptionChanged"
              >
                reset
              </v-btn>
              <v-btn
                @click="changeDescription"
                class="text-capitalize"
                color="primary"
                :disabled="isDescriptionChanged"
              >
                save
              </v-btn>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-4 col-4 pa-0 d-flex flex-column">
          <div class="mb-2">
            <div>
              <v-chip
                v-for="(item, i) in task.links"
                :key="item + i"
                close
                class="mb-2 mr-1"
                label
                @click:close="removeLink(i)"
              >
                <p class="text-truncate ma-0">{{ item }}</p>
              </v-chip>
            </div>
            <PlanningBoardInput
              @submit="addLink"
              v-model="isOpenLinkInput"
              class="planning-task-title-input"
            />
            <v-btn
              v-if="!isOpenLinkInput"
              class="text-capitalize"
              depressed
              tile
              color="#ECEDF0"
              @click.stop="onOpenLinkInput"
            >
              <v-icon left>insert_link</v-icon> Add link
            </v-btn>
          </div>
          
          <v-divider class="mb-1 mt-auto"/>
          <p class="caption text-right ma-0">Created {{ createdDate }}</p>
        </div>
      </div>

      <v-progress-linear
        :active="loading"
        indeterminate
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </v-card>
  </overlay>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { GET_TASK, DELETE_TASK, CHANGE_TASK } from '@/consts';
import PlanningBoardInput from '@/components/PlanningBoardInput';
import TransitionCard from '@/components/app/TransitionCard';
import moment from 'moment';

export default {
  components: { PlanningBoardInput, TransitionCard },
  data() {
    return {
      pageLoading: true,
      params: {},
      isOpenTitleInput: false,
      isOpenLinkInput: false,
      isOpenDeleteConfirm: false,
      loading: false,
      taskDescription: '',
      createdDate: '',
    };
  },
  computed: {
    ...mapGetters({
      task: GET_TASK,
    }),
    isDescriptionChanged() {
      let hasChanges = this.taskDescription !== (this.task.description || '');
      return !hasChanges;
    },
  },
  methods: {
    ...mapActions({
      getTask: GET_TASK,
      deleteTask: DELETE_TASK,
      changeTask: CHANGE_TASK,
    }),
    onOpenTitleInput() {
      this.isOpenTitleInput = true;
    },
    onOpenLinkInput() {
      this.isOpenLinkInput = true;
    },
    copyLink() {
      this.$notification({ text: 'Link copied' });
    },
    onOpenDeleteConfirm() {
      this.isOpenDeleteConfirm = true;
    },
    onDeleteTask() {
      this.loading = true;
      this.deleteTask({ params: this.params })
      .then( () => {
        this.$notification({ text: 'Task deleted successfully' });
        this.closeTask();
      })
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.loading = false);
    },
    closeTask() {
      this.$router.go(-1);
    },
    changeTitle(value) {
      this.loading = true;
      const body = { ...this.task, title: value };
      this.changeTask({ params: this.params, body })
      .then(() => this.getTask({ params: this.params }))
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.loading = false);
    },
    changeDescription() {
      this.loading = true;
      const body = { ...this.task, description: this.taskDescription }
      this.changeTask({ params: this.params, body })
      .then(() => this.getTask({ params: this.params }))
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.loading = false);
    },
    resetDescription() {
      this.taskDescription = this.task.description || '';
    },
    addLink(value) {
      if (this.task.links.includes(value)) {
        this.$notification({ text: 'Such a link already exists', color: 'red lighten-2' });
        return;
      }
      this.loading = true;
      const body = {
        ...this.task,
        links: [ ...this.task.links, value ],
      };
      this.changeTask({ params: this.params, body })
      .then(() => this.getTask({ params: this.params }))
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.loading = false);
    },
    removeLink(index) {
      this.loading = true;
      let links = [...this.task.links];
      links.splice(index, 1);
      const body = { ...this.task, links };
      this.changeTask({ params: this.params, body })
      .then(() => this.getTask({ params: this.params }))
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.loading = false);
    },
    getCreatedDate() {
      const ms = Math.abs( moment() - moment(this.task.date) );
      const min = ms / 1000 / 60;
      if(min * 60 < 60) {
        this.createdDate = `${Math.floor(min * 60)} seconds ago`;
        setTimeout(() => this.getCreatedDate(), 5000);
      }
      else if(min < 60) this.createdDate = `${Math.floor(min)} minutes ago`; 
      else if(min / 60 < 24) this.createdDate = `${Math.floor(min / 60)} hours ago`;
      else this.createdDate = `${Math.floor(min / 24)} days ago`;
    },
  },
  mounted() {
    this.params = {
      categoryId: this.$route.params.categoryId,
      taskId: this.$route.params.taskId,
    };
    this.getTask({ params: this.params })
    .then(() => {
      this.taskDescription = this.task.description || '';
      this.getCreatedDate();
    })
    .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
    .finally(() => this.pageLoading = false);
  },
}
</script>

<style scoped>
.planning-task-page {
  align-items: flex-start;
  padding: 5% 10px 15px 10px;
  z-index: 2;
  animation: fade .3s;
  min-height: 100%;
  bottom: auto;
  overflow: hidden;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media screen and (max-width: 375px) {
  .planning-task-id {
    max-width: 130px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.planning-task-title-btn {
  display: flex;
  align-items: center;
  border-radius: 5px;
  height: 40px;
  padding: 0 10px;
  font-size: 18px;
  color: #172B4D;
  transition: background .2s;
}
.planning-task-title-btn:hover {
  background: #EBECF0;
}
.planning-task-title-icon {
  color: #172B4D;
}
</style>