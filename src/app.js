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
  rental: null, //current new rental
  return: null, //current rental return
  //rentals: null, //list of rentals
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
          //TODO show modal confirmation?
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
      var xhr = new XMLHttpRequest();
      var vm = this;
      //TODO should this timeout?
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            //TODO use request.readyState == 4 && request.status == 200, add error handling
            data.isSingle = true;
            vm.$router.app.data.customer = JSON.parse(xhr.responseText);
            //TODO pretty phone number
            console.log(data.customer);
            //vm.$router.push({ name: 'customerView', params: { id: id }});
            console.log('API response');
            console.log(app.$route.path.indexOf('rental'));
            if (app.$route.path.indexOf('rental') > -1) {
              //set rental customer
              var customer = JSON.parse(xhr.responseText);
              vm.$router.app.$emit('rentalCustomer', customer);
              //UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
              console.log(data.rental);
            }
            else {
              app.$router.push(callbackRoute);
            }
          }
      }; 
      xhr.open('GET', url);
      xhr.send();
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
      console.log('call getMovie '+id);
      var xhr = new XMLHttpRequest();
      var url = "/api/Movies/"+id; //for new
      var vm = this;

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var newRental = app.$route.path.indexOf('rentals/new') > -1;
          var movie = JSON.parse(xhr.responseText);
          console.log(movie);
          if (newRental) {
            //new rental
            //check status
            if (movie.status == 0) {
              vm.data.rental.movies.push(movie);
            }
            else if (movie.status == 1) {
              //TODO error movie not in stock
            }
            else {
              //TODO error movie not found in system?
            }
            console.log(data.rental);
          }
          else {
            //rental return
            //check status
            if (movie.status == 1) {
              vm.data.return.movies.push(movie);
            }
            else if (movie.status == 0) {
              //TODO error movie not in stock
            }
            else {
              //TODO error movie not found in system?
            }
            console.log(data.renturn);
          }
        }
        else {
          //TODO other errors?
        }
      }; 
      xhr.open('GET', url);
      xhr.send();
    },
    /*
    //TODO remove?
    postMovie(movie, callbackRoute) {
      //TODO Is callback needed? Does this ever go anywhere except to the customer's profile?
      var xhr = new XMLHttpRequest();
      var url = "/api/Movies"; //for new
      var vm = this;

      var title = movie.title;
      var genre = ""; //TODO?
      var releaseYear = movie.releaseYear;
      var upc = movie.upc;
      var jsonData = "";

      if (data.isNew) {
        jsonData = JSON.stringify({"Title":title, "Genre":genre, "ReleaseYear":releaseYear, "Upc":upc});
      }
      else {
        url = "/api/Movies/"+movie.movieId; //for new
        jsonData = JSON.stringify({ "Title": title, "ReleaseYear": releaseYear, "Genre": genre, "Upc": upc, "Status": movie.status});
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
            //var route = {name: 'movieView', params: {id: response.upc }};
            //app.getCustomer(response.key, route);
            //TODO need API change
          }
          else {
            //calls for deletes
            //for loop

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

    },*/
    getReport(type){
      console.log('call get report '+type);
      var jsonData = JSON.stringify({"reportType":type}); //TODO make dynamic?
      var xhr = new XMLHttpRequest();
      var url = "/api/Reports"; //for new
      var vm = this;

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          data.reports = JSON.parse(this.responseText);
          //vm.$router.push(callbackRoute);
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    }
  },
  mounted() {
    var vm = this;
    console.log(vm);  
    //manager 1 employee 2 
    vm.$on('login', function(user){
      data.user = user; //userId
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
    vm.$on('resetLogin', function(params){
      var xhr = new XMLHttpRequest();
      var url = "/api/resetPassword"+data.employee.employeeId;
      var jsonData = JSON.stringify({"ManagerInfo":{"username":data.user,"password":params.managerPass},"NewPw":params.userPass});
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function() {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          //TODO success message
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
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
      app.postEmployee(employee, callbackRoute);
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
        if (!isRental) {
          //view customer url
          app.getCustomer(query, { name: 'customerView', params: {id: query} });
        }
        else {
          app.getCustomer(query, { name: 'rental', params: { id: 'new'}});
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
    //for status 1 is checked out, 0 is in stock, -1 is on hold
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
          for (var i = 0; i < copies.length; i++) {
            var inMovieList= false;
            for (var j=0; j < movies.length; j++) {
              if (copies[i].upc == movies[j].upc) {
                //update if showing as out of stock
                if (!movies[j].inStock) {
                  movies[j].inStock = copies[i].status == 0; //keep setting until true
                  inMovieList = true;
                }
              }
            }
            if (!inMovieList) {
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
          var stock = JSON.parse(this.responseText);
          var copies = [];
          console.log(copies);
          //process result
          var stockCount = 0;
          for (var i=0; i<stock.length; i++) {
            console.log("processing "+i);
            if (stock[i].status == 0) {
              stockCount++;
            }
            copies[i] = {
              id: stock[i].movieId,
              status: stock[i].status
            }
          }
          data.movie = {
            title: stock[0].title,
            upc: stock[0].upc,
            releaseYear: stock[0].releaseYear,
            stock: stockCount,
            copies: copies,
            copiesEdit: [],
            editRef: {
              title: stock[0].title,
              upc: stock[0].upc,
              releaseYear: stock[0].releaseYear,
            }
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
    vm.$on('createMovie', function() {
      console.log('call createMovie');
      var Title = data.movie.title;
      var Upc = data.movie.upc;
      var ReleaseYear = data.movie.releaseYear;
      var Qty = data.movie.qty;

      var xhr = new XMLHttpRequest();
      var url = "/api/Movies";
      var jsonData = JSON.stringify({"Title": Title, "ReleaseYear": ReleaseYear, "Genre": null, "Upc": Upc, "Qty": Qty});
      var vm = this;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var stock = JSON.parse(this.responseText);
          data.movie.copies = [];
          data.movie.copiesEdit = [];
          for (var i=0; i<stock.length; i++) {
            data.movie.copies[i] = {
              id: stock[i].id,
              status: 0
            }
          }
          console.log(data.movie);
          vm.$router.push({name:'movieView', params: {id: data.movie.upc}});
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    //load edit form for movie title
    vm.$on('editMovie', function(id){
      console.log('call editMovie '+id);
      //get a local copy of the stock
      var copies = data.movie.copies.slice(0);
      for (var i=0; i < copies.length; i++) {
        copies[i]["editStatus"] = 0; //0: update, -1: delete, 1: add
      }
      data.movie.copiesEdit = copies;
      //no get request since we're already viewing a movie
      this.$router.push({ name: 'movieEdit', params: { id: id }});
    });
    vm.$on('addCopy', function(copy){
      //add to local copies
      data.movie.copiesEdit.push(copy);
    });
    vm.$on('deleteCopy', function(id){
      //change status on local copies
      var copies = data.movie.copiesEdit;
      var copy;
      for (var i=0; i < copies.length; i++) {
        if (copies[i].id == id) {
          console.log(copies[i].editStatus)
          if (copies[i].editStatus == 1) {
            //remove new item
            copies.splice(i, 1);
          }
          else {
            //change to delete status
            copy = copies[i];
            copy.editStatus = -1;
            copies.splice(i, 1, copy);
          }
        }
      }
    });
    vm.$on('undeleteCopy', function(id){
      //change status on local copies
      var copies = data.movie.copiesEdit;
      var copy;
      for (var i=0; i < copies.length; i++) {
        if (copies[i].id == id) {
          copy = copies[i];
          copy.editStatus = 0;
          copies.splice(i, 1, copy);
        }
      }
    });
    //submit edit form for movie
    vm.$on('updateMovie', function(params){
      //generate list for post
      var MovieList = [];
      if (params.hasEdit) {
        MovieList = data.movie.copies.slice();
        //full list
        for (var i=0; i<params.delete.length; i++) {
          //delete items
          for (var j=0; j<MovieList.length; j++) {
            if (MovieList[j].id == params.delete[i]) {
              MovieList[j].status = 2;
              break;
            }
          }
        }
      }
      else {
        //only deletes
        for (var i=0; i<params.delete.length; i++) {
          var movie = {
            id: params.delete[i],
            status: 2
          };
          MovieList.push(movie);
        }
      }
      var Title = data.movie.title;
      var ReleaseYear = data.movie.releaseYear;
      var Upc = data.movie.upc;

      var xhr = new XMLHttpRequest();
      var url = "/api/Movies";
      var vm = this;
      var jsonData = JSON.stringify({"Title": Title,"ReleaseYear": ReleaseYear,"Genre": "","Upc": Upc,"MovieList": MovieList});

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          var qty = data.movie.copiesEdit.length - data.movie.copies.length;
          if (qty > 0) {
            data.movie.qty = qty;
            vm.$router.app.$emit('createMovie');
          }
          else {
            vm.$router.app.$emit('viewMovie', data.movie.upc);
          }
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    //NEW RENTAL
    //new rental 1: select customer
    vm.$on('rentalCustomer', function(customer){
      data.rental.customer = customer;
      UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      console.log(data.rental);
    });
    //new rental 2: add movie to list of movies in rental?
    vm.$on('rentalAddMovie', function(id){
      console.log('call rentalAddMovie');
      app.getMovie(id);
    });
    //new rental 3: submit rental
    vm.$on('rentalNew', function(rental){
      //POST request to API
      console.log('call rentalNew');
      //send login request
      //send to server
      var xhr = new XMLHttpRequest();
      var url = "/api/Transactions"; //for new
      var vm = this;

      var EmployeeId = data.user.employeeId;
      var CustomerId = data.rental.customer.customerId;
      var LateFeePaid = data.rental.customer.accountBalance;
      var PaymentType = data.rental.payment.type;
      var PaymentCard= data.rental.payment.card;
      var MovieList = [];
      var dueDate = new Date();

      for (var i = 0; i<data.rental.movies.length; i++) {
        var movie = {
          id: data.rental.movies[i].movieId,
          Cost: 3,
          DueDate: dueDate
        }
        MovieList.push(movie);
      }

      var jsonData = JSON.stringify({"EmployeeId": EmployeeId, "LateFeePaid": LateFeePaid, "PaymentType": PaymentType, "PaymentCard": PaymentCard, "MovieList": MovieList});
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          data.rental.confirmation = this.responseText;
          data.rental.payment.date = new Date();
          data.isEdit = false;
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    //RETURN RENTAL
    //return rental 1: add movie to list of movies in renturn?
    vm.$on('returnAddMovie', function(id){
      console.log('call returnAddMovie');
      app.getMovie(id);
    });
    //return rental 2: submit to API
    vm.$on('rentalReturn', function(movieList){
      var xhr = new XMLHttpRequest();
      var url = "/api/Return";
      var vm = this;
      var jsonData = JSON.stringify({"MovieList": movieList});
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          //TODO success message?
          data.isNew = false;
          data.isEdit = false;
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
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
      data.movie = {};
    }
    else if (to.fullPath[1] == 'r') {
      data.rental = {
        customer: null,
        movies: [],
        payment: null,
        dueDate: null
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
    data.return = {
      movies: []
    };
  }
  else if (to.fullPath.indexOf('reports') > -1) {
    data.reports = {};
    if (to.fullPath.indexOf('overdue') > -1) {
      app.getReport('Overdue');
    }
    else if (to.fullPath.indexOf('popular') > -1) {
      app.getReport('Popular');
    }
    else {
      app.getReport('Customer');
    } 
  }
  else {
    //view or edit obj
    data.isSingle = true;
    data.isEdit = false;
    data.isNew = false;
  }
  next();
});