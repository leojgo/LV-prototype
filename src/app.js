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
  firstName: "Cindy",
  lastName: "Johnson",
  address: "123 Fake St",
  city: "Springfield",
  state: "IL",
  zip: "60666",
  email: "cindy@example.com",
  phone: "773-131-8770" //for pete's sake don't store like this :P
};
var customer2 = {
  firstName: "Cindy",
  lastName: "Johnson",
  address: "239 Elm St",
  city: "Springfield",
  state: "IL",
  zip: "60666",
  email: "cindyisreallycool@example.com",
  phone: "773-998-2664"
};
var customer3 = {
  firstName: "Ellen",
  lastName: "Johnson",
  address: "1548 Overlook Ct",
  city: "Springfield",
  state: "IL",
  zip: "60666",
  email: "ellen@example.com",
  phone: "773-081-2761"
};
var customers = {
  "012390" : customer1, 
  "123456" : customer2,
  "023490" : customer3
};
var lastCustomer = 123456;
var movie1 = {
  title: "Blade Runner",
  year: "1982",
  copies: null, //get these later
  noStock: false //just a placeholder to test label
};
var movie2 = {
  title: "Blade Runner 2049",
  year: "2017",
  copies: null,
  noStock: false
};
var movie3 = {
  title: "Blade Runner: The Final Cut",
  year: "1982",
  copies: null,
  noStock: true
};
var movies = {
  "123456789" : movie1,
  "123456788" : movie2,
  "123456787" : movie3
};
var lastMovie = 123456789;
var items = {
  "9929398448" : {
    movie : movies["123456789"], //0
    inStock : true,
    //how are these retired? do we need to have active vs inactive?
  },
  "9929398449" : {
    movie : movies["123456789"], //0
    inStock : false,

  },
  "9929398447" : {
    movie : movies["123456789"], //0
    inStock : true,
  },
  "9929398446" : {
    movie : movies["123456788"], //1
    inStock : true,
  },
  "9929398445" : {
    movie : movies["123456788"], //1
    inStock : true,
  },
  "9929398444" : {
    movie : movies["123456787"], //2
    inStock : false,
  },
  "9929398443" : {
    movie : movies["123456787"], //2
    inStock : false,
  }
};
var lastItem = 9929398449;
var rental1 = {
  customer : customers[0],
  movies : ["9929398448","9929398443"],
  paymentType : 0,
  cardDigits : null,
  dueDate: 20180224,
  endDate: null
};
var rental2 = {
  customer : customers[1],
  movies : ["9929398448","9929398443"],
  paymentType : 0,
  cardDigits : null,
  dueDate: 20180224,
  endDate: null
};
var rentals = {
  "112233445566" : rental1,
  "112233445567" : rental2,
};
var lastRental = 112233445567;
var data = {
  company: 'Lackluster Video', //company name
  isAuthenticated: false, //auth flag
  isManager: false, //manager flag
  user: null, //user obj
  customers: null, //cusomters array for search
  movieTitles: null,
  movies: null, //movies array for search
  rentals: null, //list of rentals
  reports: null, //reports array for search
  isSingle: false, //single item flag
  isView: false,
  isEdit: false, //edit state flag
  isNew: false, //add state flag
  selected: null, //item to view or edit
  nextId: {
    customer: lastCustomer+1,
    movie: lastMovie+1,
    copy: lastItem+1,
    rental: lastRental+1
  },
  modal: null //modal dialog obj
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
      //go to home url
      router.push({name : 'home'});
    });
    vm.$on('loginHelp', function() {
      var modal = {};
      modal.title = 'Login Help';
      modal.body = '<strong>Clerks</strong> can contact a manager for help accessing the system. <strong>Managers</strong> unable to access the system, should refer to the login instructions provided in the Lackluster Video Application manual.';
      data.modal = modal;
    });
    vm.$on('clear', function(property){
      console.log('clear ' + property);
      data[property] = null;
    });
    vm.$on('cancelEdit', function(){
      data.isEdit = false;
    });
    vm.$on('searchCustomer', function(query){
      var results = {};
      for (var key in customers) {
        if (key == query) {
          //matched id
          results[key] = (customers[key]);
        }
        else if (customers[key].phone == query) {
          //matched phone -- needs formatting on keyup
          results[key] = (customers[key]);
        } 
        else if ((customers[key].firstName + " " + customers[key].lastName).indexOf(query) > -1) {
          //partial name match --TODO make case insensitive
          results[key] = (customers[key]);
        }
      }
      data.customers = results;
    });
    vm.$on('getCustomer', function(id){
      data.isSingle = true;
      data.selected = {};
      data.selected[id] = customers[id];
      console.log(data.selected[id]);
    });
    vm.$on('addCustomer', function(customer){
      customers[data.nextId.customer] = customer;
      data.isNew = false;
      data.isEdit = false;
      modal.title = 'New Customer Added';
      modal.body = "Customer" + data.nextId.customer + "has been added to the Lackluster Video rental system.";
      this.$router.app.$emit('viewCustomer', data.nextId.customer);
      data.nextId.customer++;
      //open modal?
    });
    vm.$on('editCustomer', function(id){
      data.isEdit = true;
      data.selected = {};
      data.selected[id] = customers[id];
      this.$router.push({ name: 'customerEdit', params: { id: id }});
    });
    vm.$on('updateCustomer', function(id){
      data.isEdit = false;
      data.selected = {};
      data.selected[id] = customers[id];
      this.$router.push({ name: 'customerView', params: { id: id }});
    });
    vm.$on('searchMovie', function(query){
      var results = {};
      for (var key in movies) {
        if (key == query) {
          results[key] = (movies[key]);
        }
        else if (movies[key].title.indexOf(query) > -1) {
          results[key] = (movies[key]);
        }
      }
      data.movies = results;
    });
    vm.$on('viewMovie', function(id){
      data.isSingle = true;
      var copies = [];
      //loop over all movie copies
      //console.log('view movies: loop over copies');
      for (var item in items) {
        if (items[item].movie == movies[id]) {
          copies.push({
            id : item,
            inStock : items[item].inStock
          });
        }
      }
      //console.log(movies[id]);
      data.selected = {};
      data.selected[id] = movies[id];
      for (var key in data.selected[id]) {
        console.log(key);
        //data.selected[id][key].copies = copies;
      }
      //console.log(data.selected[id].copies);
      data.selected[id].copies = copies;
      this.$router.push({ name: 'movieView', params: { id: id }});
    });
    vm.$on('addMovie', function(movie) {
      movies[data.nextId.movie] = movie;
      data.isNew = false;
      data.isEdit = false;
      this.$router.app.$emit('viewMovie', data.nextId.movie);
      //open modal?
      data.nextId.movie++;
    });
    vm.$on('addCopy', function(item){
      console.log(item);
      for (var key in data.selected) {
        console.log(data.selected[key].copies);
        data.selected[key].copies.push({
          id: item,
          inStock: true,
        });
        items[item] = {
          movie: movies[key],
          inStock: true
        };
      }
    });
    vm.$on('editMovie', function(id){
      data.isEdit = true;
      data.selected = {};
      data.selected[id] = movies[id];
      this.$router.push({ name: 'movieEdit', params: { id: id }});
    });
    vm.$on('updateMovie', function(id){
      data.isEdit = false;
      movies[id] = data.selected[id];
      //update items
      for (var key in data.selected) {
        for (var item in data.selected[key].copies) {
          if (item.inStock === null) {
            items[item.id].pop();
          }   
        }
      }
      this.$router.push({ name: 'movieView', params: { id: id }});
    });
    vm.$on('rentalCustomer', function(customerId){
      var rentalId = data.nextId.rental;
      data.selected[rentalId].customer = {};
      data.selected[rentalId].customer[customerId] = customers[customerId];
    });
    vm.$on('rentalAddMovie', function(id){
      var title = null;
      //get title
      for (var key1 in items[id]) {
        if (key1 == 'movie') {
          for (var key2 in items[id][key1]) {
            if (key2 == 'title') {
              title = items[id][key1][key2];
            }
          }
        }
      }
      //set
      for (var key in data.selected) {
        data.selected[key].movies.push({
          id: id,
          title: title
        });
      }
    });
    vm.$on('rentalMovies', function(movies){
      var rentalId = data.nextId.rental;
      data.selected[rentalId].movies = movies;
    });
    vm.$on('rentalConfirm', function(payment){
      var rentalId = data.nextId.rental;
    });
  }
});
//nav guards
router.beforeEach((to, from, next) => {
  console.log('to '+to.fullPath);
  if (to.fullPath.indexOf('search') > -1) {
    data.isSingle = false;
    data.isView = false;
    data.isEdit = false;
    data.isNew = false;
  }
  else if (to.fullPath.indexOf('new') > -1) {
    data.isSingle = true;
    data.isView = false;
    data.isEdit = true;
    data.isNew = true;
    data.selected = {};
    //probably better as a switch
    if (to.fullPath[1] == 'c') {
      data.selected[data.nextId.customer] = {};
    }
    else if (to.fullPath[1] == 'm') {
      data.selected[data.nextId.movie] = {
        copies: []
      };
    }
    else {
      data.selected[data.nextId.rental] = {
        customer: null,
        movies: [],
        paymentType: null,
        cardDigits: null
      };
    }
  }
  else {
    //
  }
  next();
});