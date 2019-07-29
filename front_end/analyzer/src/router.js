import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Export from './pages/Export.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/Export',
      name: 'export',
      component: Export
    },
  ]
})
