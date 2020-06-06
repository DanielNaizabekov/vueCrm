import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import overlay from './components/app/Overlay';
import notification from './plugins/notification';
import 'normalize.css/normalize.css';

Vue.config.productionTip = false
export const bus = new Vue();

Vue.use(Vuelidate);
Vue.use(notification);
Vue.component('overlay', overlay);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
