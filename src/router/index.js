import Vue from 'vue'
import Router from 'vue-router'
import {store} from '../store/store.js'

// UI Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')
const Login = () => import('@/containers/Login')

// Views
const Dashboard = () => import('@/views/Dashboard')

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  redirect: '/dashboard',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: DefaultContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        }
      ]
    },
  ]
});

// Used for forbid access to the app qhen the user is not authenticated
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && store.state.auth_status!=="success") {
    next({name:'Login'});
  }
  else next()
});

export default router
