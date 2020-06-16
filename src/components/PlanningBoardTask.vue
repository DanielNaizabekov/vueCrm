<template>
  <div class="board-task">
    <div class="board-task-title d-flex align-center justify-space-between">
      <span>{{ task.title }}</span>
      <div
        class="board-more-wrapper board-task-more-wrapper align-self-start"
        :class="{show: isPersistentTaskMore}"
      >
        <transition-card
          @afterLeave="onCloseTaskMoreMenu"
          v-model="isOpenTaskMoreMenu"
        >
          <template #activator>
            <div @click.stop="onOpenTaskMoreMenu" class="board-more">
              <v-icon>more_horiz</v-icon>
            </div>
          </template>

          <v-card min-width="150">
            <ul class="board-more-list">
              <li class="board-more-item">Delete</li>
              <li class="board-more-item">Set limit</li>
            </ul>
          </v-card>
        </transition-card>
      </div>
    </div>
  </div>
</template>

<script>
import TransitionCard from '@/components/app/TransitionCard';

export default {
  components: { TransitionCard },
  props: {
    task: {
      type: Object,
    },
  },
  data() {
    return {
      isPersistentTaskMore: false,
      isOpenTaskMoreMenu: false,
    };
  },
  methods: {
    onOpenTaskMoreMenu() {
      this.isOpenTaskMoreMenu = true;
      this.isPersistentTaskMore = true;
    },
    onCloseTaskMoreMenu() {
      this.isPersistentTaskMore = false;
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