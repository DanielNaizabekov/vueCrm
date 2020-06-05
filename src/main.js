import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import overlay from './components/app/Overlay';
import 'normalize.css/normalize.css';

Vue.config.productionTip = false

Vue.use(Vuelidate);
Vue.component('overlay', overlay);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
