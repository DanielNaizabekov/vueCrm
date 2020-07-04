import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  HTTP_DELETE,
  CATEGORIES,
  GET_CATEGORIES,
  CHANGE_CATEGORIES_LIST,
  CREATE_CATEGORY,
  CHANGE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_TASK,
  TASK,
  GET_TASK,
  DELETE_TASK,
  CHANGE_TASK,
} from '@/consts';

const state = {
  categotiesList: [],
  task: {},
};

const getters = {
  [GET_CATEGORIES]: s => s.categotiesList,
  [GET_TASK]: s => s.task,
};

const actions = {
  [GET_CATEGORIES]({ dispatch }) {
    return dispatch(HTTP_GET, { method: CATEGORIES, mutation: GET_CATEGORIES });
  },
  [CHANGE_CATEGORIES_LIST]({ dispatch }, { body }) {
    return dispatch(HTTP_PUT, { method: CATEGORIES, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [CREATE_CATEGORY]({ dispatch }, { body }) {
    return dispatch(HTTP_POST, { method: CATEGORIES, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [CHANGE_CATEGORY]({ dispatch }, { params, body }) {
    return dispatch(HTTP_PUT, { method: CHANGE_CATEGORY, params, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [DELETE_CATEGORY]({ dispatch }, { params }) {
    return dispatch(HTTP_DELETE, { method: CHANGE_CATEGORY, params, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [CREATE_TASK]({ dispatch }, { params, body }) {
    return dispatch(HTTP_POST, { method: CREATE_TASK, params, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [DELETE_TASK]({ dispatch }, { params }) {
    return dispatch(HTTP_DELETE, { method: TASK, params, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
  [GET_TASK]({ dispatch }, { params }) {
    return dispatch(HTTP_GET, { method: TASK, params, mutation: GET_TASK });
  },
  [CHANGE_TASK]({ dispatch }, { params, body }) {
    return dispatch(HTTP_PUT, { method: TASK, params, body, mutation: false })
    .then(() => dispatch(GET_CATEGORIES));
  },
};

const mutations = {
  [GET_CATEGORIES](state, data) {
    let categotiesList = data
    ? Object.keys(data).map(categoryKey => ({ ...data[categoryKey], id: categoryKey }))
    : [];

    categotiesList.length && categotiesList.forEach(cat => {
      cat.tasks = cat.tasks
      ? Object.keys(cat.tasks).map(taskKey => ({ ...cat.tasks[taskKey], id: taskKey }))
      : [];
    });

    categotiesList.sort((next, prev) => next.order < prev.order ? -1 : 0);
    categotiesList.forEach(item => {
      item.tasks.sort((next, prev) => next.order < prev.order ? -1 : 0);
    });
    state.categotiesList = categotiesList;
  },
  [GET_TASK](state, data) {
    data.links = data.links || [];
    state.task = data;
  },
  changeTaskOrder(state, { roamingTask, toTask, categoryId }) {
    let categotiesList = [...state.categotiesList];
    const category = categotiesList.find(item => item.id === categoryId);
    const roamingTaskIndex = category.tasks.findIndex(item => item.id === roamingTask.id);
    const toTaskIndex = category.tasks.findIndex(item => item.id === toTask.id);

    category.tasks[roamingTaskIndex].order = toTask.order;
    category.tasks[toTaskIndex].order = roamingTask.order;
    
    categotiesList.forEach(item => {
      item.tasks.sort((next, prev) => next.order < prev.order ? -1 : 0);
    });
  },
  removeTask(state, { roamingTask, categoryId }) {
    const category = state.categotiesList.find(item => item.id === categoryId);
    const taskIndex = category.tasks.findIndex(item => item.id === roamingTask.id);
    category.tasks.splice(taskIndex, 1);
  },
  appendTask(state, { roamingTask, categoryId }) {
    const category = state.categotiesList.find(item => item.id === categoryId);
    category.tasks.push(roamingTask);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
}