<template>
  <div class="board">
    <header class="board-header d-flex justify-space-between align-center">
      <PlanningBoardInput
        @submit="changeCategoryTitle" 
        v-model="isOpenHeaderInput"
        :inputValueProp="category.title"
      />
      <button
        v-if="!isOpenHeaderInput"
        class="board-btn board-header-btn"
        @click.stop="openHeaderInput"
      >
        <v-icon size="15">create</v-icon>
        <span class="ml-1">{{ category.title }}</span>
      </button>

      <div class="board-header-counter" :class="{hide: isOpenHeaderInput}">{{ category.tasks.length }}</div>

      <v-progress-circular
        v-if="changeCategoryLoading"
        size="25"
        width="3"
        color="#42526E"
        indeterminate
      />
      <div
        v-else
        class="board-more-wrapper board-header-more-wrapper"
        :class="{show: isPersistentHeaderMore, hide: isOpenHeaderInput}"
      >
        <transition-card
          @afterLeave="onCloseHeaderMoreMenu"
          v-model="isOpenHeaderMoreMenu"
        >
          <template #activator>
            <div @click.stop="onOpenHeaderMoreMenu" class="board-more">
              <v-icon>more_horiz</v-icon>
            </div>
          </template>

          <v-card min-width="150">
            <ul class="board-more-list">
              <li @click="onDeleteCategory" class="board-more-item">Delete</li>
              <li @click="onOpenSetLimitModal" class="board-more-item">Set limit</li>
            </ul>
          </v-card>
        </transition-card>
      </div>
    </header>

    <section @dragover.prevent @drop="sectionDrop" class="board-content">
      <draggable
        ghost-class="board-content-list-ghost"
      >
        <!-- <PlanningBoardTask
          v-for="item in categoryModel.tasks"
          :key="item.id"
          :task="item"
          :categoryId="categoryModel.id"
        /> -->
      </draggable>


      <PlanningBoardTask
        @taskDrop="sectionDrop"
        v-for="item in categoryModel.tasks"
        :key="item.id"
        :task="item"
        :categoryId="categoryModel.id"
      />
    </section>

    <footer class="board-footer">
      <PlanningBoardInput @submit="onCreateTask" v-model="isOpenCreateTaskInput"/>
      <button v-if="!isOpenCreateTaskInput" @click.stop="onOpenCreateTaskInput" class="board-btn board-footer-btn">
        <v-icon class="board-footer-btn-icon">add</v-icon>
        <span>Create task</span>
      </button>
    </footer>

    <v-dialog v-model="isOpenSetLimitModal" width="300">
      <v-card>
        <overlay v-if="setLimitModalLoading">
          <v-progress-circular indeterminate color="#fff"/>
        </overlay>

        <v-card-title>
          <span class="headline">Set limit</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Count"
            hint="Maximum tasks in a category"
            :error-messages="getValidationErrors(planningValidations.limit)"
            persistent-hint
            v-model="limit"
          />

          <v-scroll-x-transition>
            <div class="limit-error" v-show="setLimitErrors">{{ setLimitErrors }}</div>
          </v-scroll-x-transition>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="onCloseSetLimitModal" color="blue-grey darken-1" dark small>Close</v-btn>
          <v-btn @click="onSetLimit" color="blue-grey darken-1" dark small>Set</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TransitionCard from '@/components/app/TransitionCard';
import PlanningBoardTask from '@/components/PlanningBoardTask';
import PlanningBoardInput from '@/components/PlanningBoardInput';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { CHANGE_CATEGORY, DELETE_CATEGORY, CREATE_TASK, GET_CATEGORIES, CHANGE_CATEGORIES_LIST } from '@/consts';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';
import { planningValidations } from '@/utils/validationOptions';
import { required, numeric } from 'vuelidate/lib/validators';
import moment from 'moment';
import draggable from 'vuedraggable';

export default {
  components: { TransitionCard, PlanningBoardTask, PlanningBoardInput, draggable },
  props: {
    category: {
      type: Object,
    },
  },
  data() {
    return {
      planningValidations,
      isOpenHeaderInput: false,
      isPersistentHeaderMore: false,
      isOpenHeaderMoreMenu: false,
      changeCategoryLoading: false,
      isOpenCreateTaskInput: false,
      isOpenSetLimitModal: false,
      setLimitModalLoading: false,
      limit: '',
      setLimitErrors: '',
      categoryModel: {...this.category},
    };
  },
  watch: {
    category(v) {
      this.categoryModel = v;
    },
  },
  validations: {
    limit: { required, numeric },
  },
  mixins: [prepareErrors],
  computed: {
    ...mapGetters({
      categoriesList: GET_CATEGORIES,
    }),
  },
  methods: {
    ...mapActions({
      changeCategory: CHANGE_CATEGORY,
      deleteCategory: DELETE_CATEGORY,
      createTask: CREATE_TASK,
      changeCategoriesList: CHANGE_CATEGORIES_LIST,
    }),
    ...mapMutations(['changeTasksList']),
    openHeaderInput() {
      this.isOpenHeaderInput = true;
    },
    closeHeaderInput() {
      this.isOpenHeaderInput = false;
    },
    onOpenHeaderMoreMenu() {
      this.isOpenHeaderMoreMenu = true;
      this.isPersistentHeaderMore = true;
    },
    onCloseHeaderMoreMenu() {
      this.isPersistentHeaderMore = false;
    },
    changeCategoryTitle(value) {
      this.changeCategoryLoading = true;
      const body = {...this.category, title: value};
      this.changeCategory({ params: {id: this.category.id}, body })
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.changeCategoryLoading = false);
    },
    onDeleteCategory() {
      this.changeCategoryLoading = true;
      this.deleteCategory({ params: {id: this.category.id} })
      .then( () => this.$notification({ text: 'Category deleted successfully' }) )
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.changeCategoryLoading = false);
    },
    onOpenSetLimitModal() {
      this.isOpenSetLimitModal = true;
    },
    onCloseSetLimitModal() {
      this.isOpenSetLimitModal = false;
    },
    onSetLimit() {
      if(this.$v.limit.$invalid) return this.$v.limit.$touch();
      this.setLimitModalLoading = true;
      
      const body = {...this.category};
      body.limit = this.limit;

      this.changeCategory({ params: {id: this.category.id}, body })
      .then(() => {
        this.onCloseSetLimitModal();
        this.$notification({ text: 'Limit set successfully' });
      })
      .catch(e => this.setLimitErrors = this.getServerErrors(e))
      .finally(() => this.setLimitModalLoading = false);
    },
    onOpenCreateTaskInput() {
      this.isOpenCreateTaskInput = true;
    },
    onCreateTask(value) {
      this.changeCategoryLoading = true;
      const body = { title: value, date: moment().valueOf(), order: moment().valueOf() };
      this.createTask({ params: {categoryId: this.category.id}, body })
      .then( () => this.$notification({ text: 'Task created successfully' }) )
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.changeCategoryLoading = false);
    },


    // changeTaskPlace() {
    //   this.changeCategoryLoading = true;
    //   let categoriesList = [...this.categoriesList];
    //   const category = {...this.categoryModel};
    //   const categoryIndex = categoriesList.findIndex(cat => cat.id === category.id);
    //   categoriesList[categoryIndex] = category;

    //   this.changeTasksList(categoriesList);
    //   this.onChangeCategoriesList();
    // },
    // onChangeCategoriesList() {
    //   const body = {};
    //   this.categoriesList.forEach(cat => {
    //     let tasks = {};
    //     cat.tasks.forEach(task => tasks[task.id] = {...task});

    //     body[cat.id] = {
    //       ...cat,
    //       tasks,
    //     };
    //   });
    //   this.changeCategoriesList({ body })
    //   .finally(() => this.changeCategoryLoading = false)
    // }



    sectionDrop(e, toTask) {
      let { task, categoryId } = JSON.parse( e.dataTransfer.getData('selectedTask') );

      let hasTask = this.category.tasks.find(item => item.id === task.id);
      if(hasTask) {
        this.changePlaceTask(task, toTask);
      } else {
        this.removeTask(task, categoryId);
        this.appendTask(task);

        const body = {}
        this.categoriesList.forEach(cat => {
          let tasks = {};
          cat.tasks.forEach(task => tasks[task.id] = {...task});

          body[cat.id] = {
            ...cat,
            tasks,
          };
        });
        this.changeCategoriesList({body});
      }
    },
    changePlaceTask(task, toTask) {
      const body = { task, toTask, categoryId: this.category.id };
      this.$store.commit('changePlaceTask', body);
      
      let tasks = {};
      this.category.tasks.forEach(task => tasks[task.id] = {...task});
      const data = { ...this.category, tasks };
      this.changeCategory({ params: {id: this.category.id}, body: data })
    },
    removeTask(task, categoryId) {
      const body = { task, categoryId };
      this.$store.commit('removeTask', body);
    },
    appendTask(task) {
      const body = { task, categoryId: this.category.id };
      this.$store.commit('appendTask', body);
    },
  },
}
</script>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  flex: 1 0 210px;
  max-width: 270px;
  padding: 5px;
  border-radius: 6px;
  background: #F4F5F7;
}
.board-btn {
  display: inline-block;
  padding: 0 8px;
  height: 40px;
  border-radius: 5px;
  border: 0;
  outline: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: background .2s;
}
.board-btn:hover {
  background: #EBECF0;
}
.board-btn:active {
  background: #CDE1FC;
  color: #115ED0;
}
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
.board-header:hover .board-header-more-wrapper{
  opacity: 1;
}
@media screen and (max-width: 768px) {
  .board-more-wrapper {
    opacity: 1;
  }
}

.board-header {
  cursor: grab;
}
.board-header:active {
  cursor: grabbing;
}
.board-header-btn {
  color: #5E6C84;
  font-size: 12px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
}

.board-header-counter {
  font-size: 12px;
  margin: 0 auto 0 3px;
}
.board-header-counter.hide {
  display: none;
}

.board-content {
  margin-top: 7px;
  flex: 1;
}
.board-content-list {
  height: 100%;
}
.board-content-list-ghost {
  background: #e1e5ee;
}

.board-footer-btn {
  width: 100%;
  color: #42526E;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}
.board-footer-btn-icon {
  font-size: 20px;
  color: #42526E;
  margin-right: 7px;
}

.limit-error{
  text-align: center;
  color: #ff5252;
  font-size: 12px;
  height: 0;
}
</style>