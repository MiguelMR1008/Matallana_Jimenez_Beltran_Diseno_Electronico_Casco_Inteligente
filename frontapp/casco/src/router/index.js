import Vue from 'vue'
import VueRouter from 'vue-router'
import Inicio from '../views/Inicio.vue'
import Home from '../views/Home.vue'
import Registro from '../views/Registro.vue'
import Configuracion from '../views/Configuracion.vue'
import Datos from '../views/Datos.vue'
import MapaVista from '../views/MapaVista.vue'
import Estadodis from '../views/Estadodis.vue'
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
    path: '/config',
    name: 'Configuracion',
    component: Configuracion
  },
  {
    path: '/data',
    name: 'Datos',
    component: Datos
  },
  {
    path: '/mapa',
    name: 'MapaVista',
    component: MapaVista
  },
  {
    path: '/estado',
    name: 'Estadodis',
    component: Estadodis  
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
