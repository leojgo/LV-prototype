"use strict";

import Vue from 'vue';
import App from './App.vue';
import router from './routes.js';


//import UIkit from './js/uikit'; 
//import Icons from './dist/js/uikit-icons';

// loads the Icon plugin
//UIkit.use(Icons);

// components can be called from the imported UIkit reference
// UIkit.notification('Hello world.');
var customer1 = {
  id: "012390",
  name: "Cindy Johnson",
  address: "123 Fake St, Springfield, IL 60666",
  phone: "773-131-8770"
};
var customer2 = {
  id: "123456",
  name: "Cindy Johnson",
  address: "239 Elm St, Springfield, IL 60666",
  phone: "773-998-2664"
};
var customer3 = {
  id: "023490",
  name: "Ellen Johnson",
  address: "1548 Overlook Ct, Springfield, IL 60666",
  phone: "773-081-2761"
};
var customers = [
  customer1, 
  customer2,
  customer3
];
var data = {
  company: 'Lackluster Video',
  isAuthenticated: false,
  isManager: null,
  user: null,
  customers: null,
  movies: null,
  reports: null
};
var app = new Vue({
  el: '#app',
  router,
  template: '<App :data="data"/>',
  components: { App },
  data() {
    return { 
      data
    };
  },
  mounted() {
    var vm = this;
    console.log(vm);   
    console.log(customers);
    vm.$on('login', function(user){
      data.user = user;
      data.isAuthenticated = true;
      if (user.role == "Manager") {
        data.isManager = true;
      }
    }); 
    vm.$on('logout', function() {
      data.isAuthenticated = false;
      data.isManager = false;
      data.user = null;
    });
    vm.$on('customerSearch', function(query){
      var results = new Array;
      var i;
      var j;
      for (i = 0; i < customers.length; i++) {
        if (customers[i].id == query || customers[i].phone == query) {
          results.push(customers[i]);
        }
        else if (customers[i].name.indexOf(query) > -1) {
          results.push(customers[i]);
        }
      }
      data.customers = results;
    });
  }
});
//nav guards
router.beforeEach((to, from, next) => {
  console.log('to '+to.fullPath);
  console.log(app.data.company);
  next();
});