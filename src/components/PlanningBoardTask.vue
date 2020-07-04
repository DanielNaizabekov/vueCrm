<template>
  <div
    class="board-task"
    draggable="true"
    @dragstart="selectTask"
    @drop.stop="dropTask"
    @dragover.prevent
    @click="taskDetail"
  >
    <div class="board-task-title d-flex align-center justify-space-between">
      <span>{{ task.title }}</span>
      
      <v-progress-circular
        v-if="taskChangeLoading"
        size="22"
        width="3"
        color="#42526E"
        indeterminate
        class="my-2"
      />

      <div
        v-else
        class="board-more-wrapper board-task-more-wrapper align-self-start"
        :class="{show: isPersistentTaskMore}"
      >
        <transition-card
          @afterLeave="destroyPersisntent"
          v-model="isOpenTaskMoreMenu"
        >
          <template #activator>
            <div @click.stop="onOpenTaskMoreMenu" class="board-more">
              <v-icon>more_horiz</v-icon>
            </div>
          </template>

          <v-card min-width="150">
            <ul class="board-more-list">
              <li @click.stop="onDeleteTask" class="board-more-item">Delete</li>
              <li @click.stop="copyLink" class="board-more-item">Copy link</li>
            </ul>
          </v-card>
        </transition-card>
      </div>
    </div>
  </div>
</template>

<script>
import TransitionCard from '@/components/app/TransitionCard';
import { mapActions } from 'vuex';
import { DELETE_TASK } from '@/consts';

export default {
  components: { TransitionCard },
  props: {
    task: {
      type: Object,
    },
    categoryId: {
      type: String,
    },
  },
  data() {
    return {
      isPersistentTaskMore: false,
      isOpenTaskMoreMenu: false,
      taskChangeLoading: false,
    };
  },
  methods: {
    ...mapActions({
      deleteTask: DELETE_TASK,
    }),
    onOpenTaskMoreMenu() {
      this.isOpenTaskMoreMenu = true;
      this.isPersistentTaskMore = true;
    },
    onCloseTaskMoreMenu() {
      this.isOpenTaskMoreMenu = false;
    },
    destroyPersisntent() {
      this.isPersistentTaskMore = false;
    },
    onDeleteTask() {
      this.taskChangeLoading = true;
      const params = {
        categoryId: this.categoryId,
        taskId: this.task.id,
      };
      this.deleteTask({ params })
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.taskChangeLoading = true);
    },
    taskDetail() {
      this.$router.push({
        name: 'planningTask',
        params: {
          categoryId: this.categoryId,
          taskId: this.task.id,
        },
      });
    },
    copyLink() {
      this.$notification({ text: 'Link copied' });
      this.onCloseTaskMoreMenu();
    },
    selectTask(event) {
      let data = JSON.stringify({
        roamingTask: {...this.task},
        roamingTaskCatId: this.categoryId,
      });
      event.dataTransfer.setData('roamingTask', data);
    },
    dropTask(e) {
      this.$emit('drop', e, {...this.task});
    },
  },
}
</script>

<style scoped>
.board-more-wrapper {
  opacity: 0;
  margin: 3px;
}
.board-more-wrapper.hide {
  display: none;
}
.board-more-wrapper.show {
  opacity: 1;
  background: #E2E4E9;
}
.board-more {
  color: #51607A;
  width: 36px;
  height: 32px;
  text-align: center;
  border-radius: 3px;
  transition: background .2s;
  cursor: pointer;
}
.board-more i {
  font-size: 28px;
  line-height: 32px;
}
.board-more:hover {
  background: #E2E4E9;
}
.board-more:active {
  background: #CDE1FC;
  color: #115ED0;
}
.board-more-list {
  width: 100%;
  padding: 5px 0;
  border-radius: 5px;
  font-size: 13px;
  letter-spacing: .4px;
  color: #172B4D;
}
.board-more-item {
  padding: 7px 10px;
  cursor: pointer;
}
.board-more-item:hover {
  background: #F4F5F7;
}
.board-task:hover .board-task-more-wrapper {
  opacity: 1;
}
@media screen and (max-width: 768px) {
  .board-more-wrapper {
    opacity: 1;
  }
}

.board-task {
  background: #FEFEFE;
  border-radius: 3px;
  padding: 5px;
  box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px, rgba(23, 43, 77, 0.2) 0px 0px 1px;
  transition: background .2s;
  margin-bottom: 5px;
  cursor: pointer;
}
.board-task:hover {
  background: #F4F5F7;
}
.board-task-title {
  font-size: 14px;
  color: #172B4D;
  padding-left: 5px;
}
</style>