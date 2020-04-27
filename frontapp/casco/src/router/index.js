import Vue from 'vue'
import VueRouter from 'vue-router'
import Inicio from '../views/Inicio.vue'
import Home from '../views/Home.vue'
import Registro from '../views/Registro.vue'
import RegistroData from '../views/RegistroData.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: Inicio
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Registro',
    component: Registro
  },
  {
    path: '/regdisp',
    name: 'RegistroData',
    component: RegistroData
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
