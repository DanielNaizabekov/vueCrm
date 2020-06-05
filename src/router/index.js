import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('../components/app/Layout'),
      children: [
        {
          path: '',
          name: 'spending',
          component: () => import('../views/Spending'),
        },
        {
          path: 'currency/',
          name: 'currency',
          component: () => import('../views/Currency'),
        },
        {
          path: 'profile/',
          name: 'profile',
          component: () => import('../views/Profile'),
        },
      ],
      beforeEnter(_,__,next) {
        const token = JSON.parse( localStorage.getItem('token') );
        if (token) next();
        else next({name: 'auth'});
      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/entry-views/Auth'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/entry-views/Register'),
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: () => import('../views/entry-views/ResetPassword'),
    },
  ],
});