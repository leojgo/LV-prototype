import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Rental from './components/Rental.vue'
import Movie from './components/Movie.vue'
import Customer from './components/Customer.vue'
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
      path: '/rentals/new',
      name: 'newRental',
      component: Rental
    },
    {
      path: '/movies/search',
      name: 'movie',
      component: Movie
    },
    {
      path: '/movies/:id',
      name: 'movieView',
      component: Movie
    },
    {
      path: '/movies/:id/edit',
      name: 'movieEdit',
      component: Movie
    },
    {
      path: '/customers/search',
      name: 'customerSearch',
      component: Customer,
    },
    {
      path: '/customers/new',
      name: 'CustomerNew',
      component: Customer,
    },
    {
      path: '/customers/:id',
      name: 'customerView',
      component: Customer
    },
    {
      path: '/customers/:id/edit',
      name: 'customerEdit',
      component: Customer
    },
    {
      path: '/customers/:id/history',
      name: 'customerHistory',
      component: Customer
    },
    {
      path: '/customers/:id/ledger',
      name: 'customerLedger',
      component: Customer
    },
    {
      path: '/reports/:type',
      name: 'report',
      component: Report
    }
  ]
})