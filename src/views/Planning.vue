<template>
  <Card class="pr-4">
    <v-sheet v-if="pageLoading" color="grey lighten-4" class="pa-1">
      <v-skeleton-loader type="article"/>
    </v-sheet>

    <div v-else class="planning-wrapper d-flex flex-wrap">
      <PlanningBoard
        v-for="item in categoriesList"
        :key="item.id"
        class="mr-3 mb-3"
        :category="item"
      />
      <div class="planning-create-wrapper mr-3">
        <PlanningBoardInput @submit="onCreateCategory" v-model="isOpenCreateInput"/>
        <v-progress-circular
          v-if="createCategoryLoading"
          size="30"
          width="3"
          color="#42526E"
          indeterminate
        />
        <div
          v-else-if="!isOpenCreateInput"
          @click.stop="onOpenCreateInput" 
          class="planning-create"
        >
          <v-icon>add</v-icon>
        </div>
      </div>
    </div>

    <router-view/>
  </Card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Card from '@/components/app/Card';
import PlanningBoard from '@/components/PlanningBoard';
import PlanningBoardInput from '@/components/PlanningBoardInput';
import { GET_CATEGORIES, CREATE_CATEGORY } from '@/consts';

export default {
  components: { Card, PlanningBoard, PlanningBoardInput },
  data() {
    return {
      pageLoading: true,
      isOpenCreateInput: false,
      createCategoryLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      categoriesList: GET_CATEGORIES,
    }),
  },
  methods: {
    ...mapActions({
      getCategories: GET_CATEGORIES,
      createCategory: CREATE_CATEGORY,
    }),
    onOpenCreateInput() {
      this.isOpenCreateInput = true;
    },
    onCreateCategory(value) {
      this.createCategoryLoading = true;
      const body = { title: value };
      this.createCategory({ body })
      .then( () => this.$notification({ text: 'Category created successfully' }) )
      .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
      .finally(() => this.createCategoryLoading = false);
    },
  },
  mounted() {
    this.getCategories()
    .catch( () => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }) )
    .finally(() => this.pageLoading = false);
  },
}
</script>

<style scoped>
.planning-create-wrapper {
  height: 40px;
}
.planning-create {
  border-radius: 3px;
  color: #505F79;
  width: 36px;
  height: 32px;
  text-align: center;
  background: #F4F5F7;
  cursor: pointer;
  transition: background .2s;
}
.planning-create:hover {
  background: #E2E4E9;
}
.planning-create:active {
  background: #CDE1FC;
  color: #115ED0;
}
.planning-create i {
  line-height: 32px;
}

@media(max-width: 519px) {
  .planning-wrapper {
    justify-content: center;
  }
  .planning-create-wrapper {
    flex: 1 0 210px;
    max-width: 270px;
  }
}

@media(max-width: 450px) {
  .planning-wrapper {
    padding: 15px 3px 15px 15px !important;
  }
}
</style>