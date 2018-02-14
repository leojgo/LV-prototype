import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Customer from './components/Customer.vue'
import Movie from './components/Movie.vue'
import Report from './components/Report.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/customers',
      name: 'customer',
      component: Customer
    },
    {
      path: '/customers/new',
      name: 'Customer',
      component: Customer,
      props: {customerStatus:-1}
    },
    {
      path: '/movies',
      name: 'movie',
      component: Movie
    },
    {
      path: '/reports',
      name: 'report',
      component: Home
    }
  ]
})