import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/pages/Login.vue'
import Matrix from '../components/pages/Matrix.vue'
import Routes from '../components/pages/Routes.vue'
import RouteForm from '../components/pages/RouteForm.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/matrix',
    name: 'matrix',
    component: Matrix
  },
  {
    path: '/routes',
    name: 'routes',
    component: Routes
  },
  {
    path: '/routes/:route_id?/edit',
    name: 'route_edit',
    component: RouteForm
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
