import { bus } from '@/main';

export default {
  install(Vue) {
    Vue.prototype.$notification = function(options) {
      bus.$emit('openNotification', options);
    };
  },
};