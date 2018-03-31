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
  "10" : customer1, 
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
var users = {
  "443" : customer1,
  "442" : customer2,
  "441" : customer3 
}
var data = {
  company: 'Lackluster Video', //company name
  loginError: false, //flag for whether login error occurred
  isAuthenticated: false, //auth flag
  isManager: false, //manager flag
  user: null, //user obj -- current user
  employees: null, //list of employees
  employee: null, //selected employee (view/edit)
  customers: null, //cusomters array for search
  customer: null, //selected customer (view/edit)
  movieTitles: null, // TODO what is this for??
  movies: null, //movies array for search
  movie: null, //selected movie (view/edit)
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
  methods: {
    getEmployee(id, callbackRoute) {
      console.log('API call employee '+ id);
      //send login request -- TODO use a function?
      var url = "/api/Employee/"+id;
      var xhr = new XMLHttpRequest();
      //TODO should this timeout?
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            data.isSingle = true;
            data.employee = JSON.parse(xhr.responseText);
            data.employee.isManager = data.employee.employeeTitle == "Manager"; //TODO this may not be sophisticaed enough
            //TODO updates following backend revisions?
            console.log(data.employee);
            console.log('API response');
            app.$router.push(callbackRoute);
          }
      }; 
      xhr.open('GET', url);
      xhr.send();
    },
    postEmployee(employee, callbackRoute) {
      console.log('emit submitEmployeeForm ');
      console.log(employee);
      //send login request
      //send to server
      var xhr = new XMLHttpRequest();
      var url = "/api/employees"; //for new
      var vm = this;

      var FirstName = employee.firstName;
      var LastName = employee.lastName;
      var EmployeeType = employee.employeeType;
      var PhoneNumber = employee.phoneNumber;
      var jsonData;
      if (data.isNew) {
        var RawPw = employee.RawPw;
        jsonData = JSON.stringify({"FirstName": FirstName, "LastName": LastName, "EmployeeType": EmployeeType, "PhoneNumber": PhoneNumber, "RawPw": RawPw});
      }
      else {
        //update employee info
        var url = "/api/Employee/"+employee.employeeId;
        var Active = employee.active;
        var EmployeeTitle = employee.employeeTitle; //TODO remove?
        jsonData = JSON.stringify({"FirstName": FirstName, "LastName": LastName, "EmployeeType": EmployeeType, "PhoneNumber": PhoneNumber, "active": Active});
      }
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          //TODO change conditional to make sure we have status OKAY (200), add fallback for errors
          var employee = JSON.parse(this.responseText);
          if (data.isNew) {
            modal.title = 'New Employee Added';
            modal.body = "Employee " + employee.employeeId + " has been added to the Lackluster Video system users.";
            data.isNew = false; //TODO cleanup/move?
            //TODO confirmation in UI?
          }
          else {
            //TODO confirmation in UI?
          }
          //TODO show modal confirmmation?
          data.isEdit = false; //TODO cleanup/move?
          vm.$router.push(callbackRoute);
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    },
    getCustomer(id, callbackRoute) {
      console.log('API call customer '+ id);
      //send login request -- TODO use a function?
      var url = "/api/Customers/"+id;
      var request = new XMLHttpRequest();
      //TODO should this timeout?
      request.onreadystatechange = function() {
          if (request.readyState == 4) {
            //TODO use request.readyState == 4 && request.status == 200, add error handling
            data.isSingle = true;
            data.customer = JSON.parse(request.responseText);
            //TODO pretty phone number
            console.log(data.customer);
            //vm.$router.push({ name: 'customerView', params: { id: id }});
            console.log('API response');
            app.$router.push(callbackRoute);
          }
      }; 
      request.open('GET', url);
      request.send();
    },
    postCustomer(customer, callbackRoute) {
      //TODO Is callback needed? Does this ever go anywhere except to the customer's profile?
      var xhr = new XMLHttpRequest();
      var url = "/api/Customers"; //for new
      var vm = this;

      var name_First = customer.firstName;
      var name_Last = customer.lastName;
      var add_Line1 = customer.AddLine1;
      var add_City = customer.addCity;
      var add_State = customer.AddState;
      var add_Zip = customer.AddZip;
      var phoneNumber = customer.phoneNumber;
      var email = customer.email;
      var newsletter = customer.newsletter;

      var jsonData;
      if (data.isNew) {
        jsonData = JSON.stringify({"NameFirst": name_First,"NameMiddleIn": null, "NameLast": name_Last, "AddLine1": add_Line1, "AddLine2":null, "AddCity": add_City, "AddState": add_State, "AddZip": add_Zip, "PhoneNumber": phoneNumber, "Email": email, "Newsletter": newsletter});
      }
      else {
        //update customer info
        var url = "/api/Customers/"+customer.customerId;
        var active = customer.active;
        var accountBalance = customer.accountBalance;
        jsonData = JSON.stringify({"customerId": customer.customerId, "name_First": name_First, "name_Middle_In": null, "name_Last": name_Last, "add_Line1": add_Line1, "add_Line2": null, "add_City": add_City, "add_State": add_State, "add_Zip": add_Zip, "phoneNumber": phoneNumber, "email": email, "newsletter": newsletter, "accountBalance": accountBalance, "active": active});
      }

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var response = JSON.parse(this.responseText);
          console.log(response);
          if (data.isNew) {
            data.isNew = false; //TODO cleanup/move?
            var route = {name: 'customerView', params: {id: response.key }};
            app.getCustomer(response.key, route);
          }
          else {
            //TODO confirmation in UI?
            vm.$router.push(callbackRoute);
          }
          //TODO show modal confirmmation?
          data.isEdit = false; //TODO cleanup/move?
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    },
    getMovie(id){

    },
    postMovie(){

    }
  },
  mounted() {
    var vm = this;
    console.log(vm);   
    vm.$on('login', function(user){
      data.user = JSON.parse(user);
      data.isAuthenticated = true;
      console.log(data.user);
      //TODO clarify roles -- this may be too simple of an implementation
      if (data.user.employeeTitle != "Clerk") {
        data.isManager = true;
      }
    }); 
    vm.$on('loginError', function(){
      data.loginError = true;
    });
    vm.$on('clearLoginError', function(){
      data.loginError = false;
    });
    vm.$on('logout', function() {
      //TODO use a fn for get/post?
      //send logout request
      var xhr = new XMLHttpRequest();
      var url = "/api/logout";
      var user = data.user.employeeId;
      var jsonData = JSON.stringify({"username": user});
      var vm = this;

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function() {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          //TODO change conditional to make sure we have status OKAY (200), add fallback for errors
          data.isAuthenticated = false;
          data.isManager = false;
          data.user = null;
          data.loginError = false;
          //go to home url
          router.push({name : 'home'});
        }
      }
      xhr.send(jsonData);
    });
    vm.$on('loginHelp', function() {
      var modal = {};
      modal.title = 'Login Help';
      modal.body = '<strong>Clerks</strong> can contact a manager for help accessing the system. <strong>Managers</strong> unable to access the system, should refer to the login instructions provided in the Lackluster Video Application manual.';
      data.modal = modal;
    });
    vm.$on('resetLogin', function(){
      modal.title = 'Reset Login';
      modal.body = '<div class="uk-width-1-1">Reset password for employee '+employee.employeeId+', '+employee.firstName+' '+employee.lastName+'</div>';
      data.modal = modal;
    });
    vm.$on('clear', function(property){
      console.log('clear ' + property);
      data[property] = null;
    });
    vm.$on('cancelEdit', function(){
      data.isEdit = false;
    });

    //USERS (employees)
    //view employee
    vm.$on('viewEmployee', function(id) {
      console.log('call viewEmployee');
      data.isEdit = false;
      data.employee = {};
      //GET request?
      app.getEmployee(id, { name: 'userView', params: { id: id }});
    });
    //employee show edit form
    vm.$on('editEmployee', function(id){
      //set
      data.isEdit = true;
      //this.$router.push({ name: 'userList' }); //change route to edit
    });
    vm.$on('createEmployee', function(employee) {
      console.log('call createEmployee');
      var callbackRoute = { name: 'userView', params: { id: employee.employeeId }}; //go to view employee after creation
      app.postCustomer(employee, callbackRoute);
    });
    //update employee
    vm.$on('updateEmployee', function(employee) {
      console.log('call updateEmployee');
      var callbackRoute = { name: 'userView', params: { id: employee.employeeId }}; //go to view employee after update
      app.postEmployee(employee, callbackRoute);
    });
    //delete employee
    vm.$on('deleteEmployee', function(employee) {
      console.log('call deleteEmployee');
      var callbackRoute = { name: 'userList' }; //go to list of employees after deletion
      app.postEmployee(employee, callbackRoute);
    });
    //CUSTOMERS
    //search customer database
    vm.$on('searchCustomer', function(query) {
      console.log('call searchCustomer');
      var isRental = app.$route.path.indexOf('rental') > -1; //route str contains rental
      console.log(isRental);
      //validate query
      var PhoneNumber = "";
      var SearchTerm = "";
      if (query.replace(/\D/g,'') == query) {
        //all numbers
        if (query.length == 10) {
          //search is phone
          PhoneNumber = query;
        }
      }
      else {
        //name search
        SearchTerm = query;
      }
      if (SearchTerm.length == 0 && PhoneNumber.length == 0) {
        //select customer
        app.getCustomer(query);
        if (isRental) {
          //view customer url
          app.getCustomer(query);
        }
        else {
          app.getCustomer(query, { name: 'customerView', params: {id: query} });
        }
      }
      else {
        //search for name or phone
        var xhr = new XMLHttpRequest();
        var url = "/api/CustomerSearch";
        var user = data.user.employeeId;
        var jsonData = JSON.stringify({"PhoneNumber":PhoneNumber, "SearchTerm": SearchTerm});
        var vm = this;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
          //Call a function when the state changes.
          if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            data.customers = JSON.parse(this.responseText);
            console.log(data.customers);
            //TODO select customer if only one result returned
          }
          else {
            //TODO error handling
          }
        }
        xhr.send(jsonData);
      }
    });
    //view customer
    vm.$on('viewCustomer', function(id){
      data.isEdit = false;
      data.customer = {};
      //GET request
      app.getCustomer(id, { name: 'customerView', params: { id: id }});
    });
    //load edit customer form
    vm.$on('editCustomer', function(id) {
      data.isEdit = true;
      //no get request since we're already viewing customer
      this.$router.push({ name: 'customerEdit', params: { id: id }});
    });
        //add new customer
    vm.$on('createCustomer', function(customer) {
      console.log('call createCustomer');
      //TODO no employee yet -- need to rework callback
      //var callbackRoute = { name: 'customerView', params: { id: customer.customerId }}; //go to view employee after creation 
      app.postCustomer(customer, null);
    });
    //submit edit customer form
    vm.$on('updateCustomer', function(customer) {
      var callbackRoute = { name: 'customerView', params: { id: customer.customerId }};
      app.postCustomer(customer, callbackRoute);
    });
     //delete employee
    vm.$on('deleteCustomer', function(customer) {
      console.log('call customer');
      //TODO where to go to go after deletion???
      app.postCustomer(customer, { name: 'customerSearch'});
    });
    //MOVIES
    //search movie database
    vm.$on('searchMovie', function(query){
      console.log('call searchMovies');
      var upc = "";
      var title = "";
      if (query.replace(/\D/g,'') == query) {
        //all numbers
        upc = query;
      }
      else {
        //title
        title = query;
      }
      var xhr = new XMLHttpRequest();
      var url = "/api/MovieSearch";
      var jsonData = JSON.stringify({"Title": title, "ReleaseYear": null, "Genre": null, "Upc": upc});
      var vm = this;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var copies = JSON.parse(this.responseText);
          console.log(copies);
          var movies = [{
            title: copies[0].title,
            upc: copies[0].upc,
            releaseYear: copies[0].releaseYear,
            inStock: copies[0].status == 0
          }]
          for (var i = 0; i<copies.length; i++) {
            if (copies[i].upc == movies[i].upc) {
              //update if showing as out of stock
              if (!movies[i].inStock) {
                movies[i].inStock = copies[i].status == 0; //keep setting until true
              }
            }
            else {
              //add to movies
              var movie = {
                title: copies[i].title,
                upc: copies[i].upc,
                releaseYear: copies[i].releaseYear,
                inStock: copies[i].status == 0
              }
              movies.push(movie);
            }
          }
          data.movies = movies;
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    //view movie title
    vm.$on('viewMovie', function(upc){
      console.log('call viewMovie');
      var upc = (""+upc).replace(/\D/g,'');
      var title = "";
      var xhr = new XMLHttpRequest();
      var url = "/api/MovieSearch";
      var jsonData = JSON.stringify({"Title": title, "ReleaseYear": null, "Genre": null, "Upc": upc});
      var vm = this;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var copies = JSON.parse(this.responseText);
          console.log(copies);
          //process result
          var stockCount = 0;
          for (var i=0; i<copies.length; i++) {
            console.log("processing "+i);
            if (copies[i].status == 0) {
              stockCount++;
            }
          }
          data.movie = {
            title: copies[0].title,
            upc: copies[0].upc,
            year: copies[0].ReleaseYear,
            stock: stockCount,
            copies: copies
          };
          //go to view movie page
          var callbackRoute = { name: 'movieView', params: { id: upc }};
          vm.$router.push(callbackRoute);
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });

    //add new movie title to movies database
    vm.$on('addMovie', function(movie) {
      //TODO POST request to API

      //FPO
      movies[data.nextId.movie] = movie;
      data.isNew = false;
      data.isEdit = false;
      this.$router.app.$emit('viewMovie', data.nextId.movie);
      //open modal?
      data.nextId.movie++;
    });
    vm.$on('addCopy', function(item){
      //TODO refactor based on API

      //FPO
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
    //load edit form for movie title
    vm.$on('editMovie', function(id){
      //TODO test
      data.isEdit = true;
      //no get request since we're already viewing a movie
      this.$router.push({ name: 'movieEdit', params: { id: id }});

      //FPO -- remove after testing
      /*
      data.isEdit = true;
      data.selected = {};
      data.selected[id] = movies[id];
      this.$router.push({ name: 'movieEdit', params: { id: id }});
      */
    });
    //submit edit form for movie
    vm.$on('updateMovie', function(id){
      //TODO POST request to API

      //FPO
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
    //NEW RENTAL
    //new rental 1: select customer
    vm.$on('rentalCustomer', function(customerId){
      //TODO refactor
      var rentalId = data.nextId.rental;
      data.selected[rentalId].customer = {};
      data.selected[rentalId].customer[customerId] = customers[customerId];
    });
    //new rental 2: add movie to list of movies in rental?
    //return rental 1: add movie to list of movies in renturn?
    vm.$on('rentalAddMovie', function(id){
      //TODO refactor
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
    //new rental 2: confirm movies to rent
    vm.$on('rentalMovies', function(movies){
      //TODO refactor based on API
      var rentalId = data.nextId.rental;
      data.selected[rentalId].movies = movies;
    });
    //new rental 3: submit rental
    vm.$on('rentalSubmit', function(payment){
      //TODO POST request to API

      //FPO
      var rentalId = data.nextId.rental;
      data.selected[rentalId].payment = payment;
      //add to rentals table
      data.isEdit = false;
      data.nextId.rental++;
    });
    //RETURN RENTAL
    //???wtf did I do here...
    vm.$on('rentalReturn', function(payment){
      var rentalId = data.nextId.rental;
      //movies??
      data.selected[rentalId].payment = payment;
      //add to returns table
      data.isEdit = false;
      data.isNew = false;
      data.nextId.rental++;
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
    if (to.fullPath[1] == 'u') {
      //TODO refactor/rename -- it's not really a search
      //get users
      console.log(data.employees == null);
      if (data.employees == null) {
        //send login request -- TODO use a function?
        var url = "/api/employees";
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
              //TODO use request.readyState == 4 && request.status == 200, add error handling
              data.employees = JSON.parse(request.responseText);
              console.log(data.employees);
            }
        }; 
        request.open('GET', url);
        request.send();
      }
    }
  }
  else if (to.fullPath.indexOf('new') > -1) {
    data.isSingle = true;
    data.isView = false;
    data.isEdit = true;
    data.isNew = true;
    data.selected = {};
    //probably better as a switch
    if (to.fullPath[1] == 'c') {
      data.customer = {};
    }
    else if (to.fullPath[1] == 'm') {
      data.selected[data.nextId.movie] = {
        copies: []
      };
    }
    else if (to.fullPath[1] == 'r') {
      data.selected[data.nextId.rental] = {
        customer: null,
        movies: [],
        paymentType: null,
        cardDigits: null
      };
    }
    else {
      //user
      data.employee = {};
    }
  }
  else if (to.fullPath.indexOf('edit') > -1) {
    data.isSingle = true;
    data.isEdit = true;
    data.isNew = false;
  }
  else if (to.fullPath.indexOf('return') > -1) {
    data.isSingle = true;
    data.isView = false;
    data.isEdit = true;
    data.isNew = true;
    data.selected = {};
    data.selected[data.nextId.rental] = {
      customer: null,
      movies: [],
      paymentType: null,
      cardDigits: null
    };
  }
  else {
    //view or edit obj
    data.isSingle = true;
    data.isEdit = false;
    data.isNew = false;
  }
  next();
});