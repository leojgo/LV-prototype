"use strict";

import Vue from 'vue';
import App from './App.vue';
import router from './routes.js';

    window.onbeforeunload = function(e) {
      console.log('onbeforeunload');
      if (data.isAuthenticated) {
        var dialogText = 'Refreshing the page will cause you to be logged out of the system. Do you still want to continue?';
        e.returnValue = dialogText;
        return dialogText;
      }
    };

//console = {};
//console.log = function() {} 
//silence logging for now

//import UIkit from './js/uikit'; 
//import Icons from './dist/js/uikit-icons';

// loads the Icon plugin
//UIkit.use(Icons);

// components can be called from the imported UIkit reference
// UIkit.notification('Hello world.');
var data = {
  company: 'Lackluster Video', //company name
  loginError: false, //flag for whether login error occurred
  resetSuccess: false, //flag for whether reset password occurred
  isAuthenticated: false, //auth flag
  isManager: false, //manager flag
  user: null, //user obj -- current user
  errorMessage: null, //set errorMessage to show error
  successMessage: null,  //set successMessage to show success
  employees: null, //list of employees
  employee: null, //selected employee (view/edit)
  customers: null, //cusomters array for search
  customer: null, //selected customer (view/edit)
  movieTitles: null, // TODO what is this for??
  movies: null, //movies array for search
  movie: null, //selected movie (view/edit)
  rental: null, //current new rental
  return: null, //current rental return
  //rentals: null, //list of rentals -- feature tabled
  reports: null, //reports array for search
  isSingle: false, //single item flag
  isView: false,
  isEdit: false, //edit state flag
  isNew: false, //add state flag
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
      console.log('API call get employee '+ id);
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
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send();
    },
    postEmployee(employee, callbackRoute) {
      console.log('API call post employee');
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
        jsonData = JSON.stringify({
          "FirstName": FirstName, 
          "LastName": LastName, 
          "EmployeeType": EmployeeType, 
          "PhoneNumber": PhoneNumber, 
          "RawPw": RawPw
        });
      }
      else {
        //update employee info
        var url = "/api/Employee/"+employee.employeeId;
        var Active = employee.active;
        var EmployeeTitle = employee.employeeTitle; //TODO remove?
        jsonData = JSON.stringify({
          "FirstName": FirstName, 
          "LastName": LastName, 
          "EmployeeType": EmployeeType, 
          "PhoneNumber": PhoneNumber, 
          "active": Active
        });
      }
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
          //TODO change conditional to make sure we have status OKAY (200), add fallback for errors
          //TODO show modal confirmation?
          //data.isEdit = false; //routing should handle this?
          if (data.isNew) {
            //TODO set callback to user id returned from response
            var callbackRoute = { name: 'userView', params: { id: 2 }};
          }
          else {
            if (Active) {
              //success message?
              data.successMessage = 'Employee updated successfully!'
            }
            else {
              //show success message for delete on customer search
              data.successMessage = 'Employee deleted successfully!'
            }
          }
          vm.$router.push(callbackRoute);
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    },
    getCustomer(id, callbackRoute) {
      console.log('API call get customer '+ id);
      //send login request -- TODO use a function?
      var url = "/api/Customers/"+id;
      var xhr = new XMLHttpRequest();
      var vm = this;
      //TODO should this timeout?
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            //TODO use request.readyState == 4 && request.status == 200, add error handling
            data.isSingle = true;
            data.customer = JSON.parse(xhr.responseText);
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
      xhr.open('POST', url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send();
    },
    postCustomer(customer, callbackRoute) {
      //TODO Is callback needed? Does this ever go anywhere except to the customer's profile?
      var xhr = new XMLHttpRequest();
      var url = "/api/Customers"; //for new
      var vm = this;

      console.log(customer);
      console.log('call postCustomer');

      var jsonData;
      if (data.isNew) {
        jsonData = JSON.stringify({
          "NameFirst": customer.firstName,
          "NameMiddleIn":"",
          "NameLast": customer.lastName,
          "AddLine1": customer.addLine1,
          "AddLine2":"",
          "AddCity": customer.addCity,
          "AddState": customer.addState,
          "AddZip": customer.addZip,
          "PhoneNumber":customer.phoneNumber,
          "Email": customer.email,
          "Newsletter": customer.newsletter
        });
      }
      else {
        //update customer info
        var url = "/api/Customers/"+customer.customerId;
        var active = customer.active;
        var accountBalance = customer.accountBalance;
        jsonData = JSON.stringify({
          "nameFirst": customer.firstName,
          "nameMiddleIn": "",
          "nameLast": customer.lastName,
          "addLine1": customer.addLine1,
          "addLine2": "",
          "addCity": customer.addCity,
          "addState": customer.addState,
          "addZip": customer.addZip,
          "phoneNumber": customer.phoneNumber,
          "email": customer.email,
          "newsletter": customer.newsletter,
          "active": customer.active
        });
      }

      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
        //Call a function when the state changes.
      if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
          if (data.isNew) {
            //data.isNew = false;  //routing should take care of this
            var response = JSON.parse(this.responseText);
            console.log('created customer');
            var route = {name: 'customerView', params: {id: response.key }};
            app.getCustomer(response.key, route);
          }
          else {
            if (customer.active) {
              //success message?
              console.log('updated customer');
              data.successMessage = 'Customer updated successfully!'
            }
            else {
              //show success message for delete on custommer search
              console.log('deleted customer');
              //data.successMessage = 'Customer '+customer.customerId+', '+customer.nameFirst + ' ' + customer.nameLast + ', deleted successfully!'
            }
            console.log(data);
            vm.$router.push(callbackRoute);
          }
          //TODO show modal confirmmation?
          data.isEdit = false; //TODO cleanup/move?
        }
        else {
          //TODO error handling
        }
      }

      console.log('send jsonData');
      console.log(jsonData);
      xhr.send(jsonData);
    },
    getMovie(id){
      console.log('call getMovie '+id);
      var xhr = new XMLHttpRequest();
      var url = "/api/Movies/"+id; //for new
      var vm = this;
      xhr.open('POST', url, true);
      xhr.setRequestHeader("Content-type", "application/json");
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
            console.log(data.return);
          }
        }
        else {
          //TODO other errors?
        }
      }; 
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
          console.log(data.reports);
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
      if (data.user.employeeTitle == "Manager") {
        data.isManager = true;
      }
      //send to dashboard
      router.push({name : 'home'});
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
        if(xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
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
      var url = "/api/resetPassword/"+data.employee.employeeId;
      var jsonData = JSON.stringify({
        "ManagerInfo":{
            "username":data.user.employeeId, 
            "password":params.managerPass
        },
        "NewPw": params.userPass
      });
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function() {
        //Call a function when the state changes.
        if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
          //TODO success message
          data.resetSuccess = true;
          console.log(data);
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    vm.$on('clear', function(property){
      console.log('clear ' + property);
      if (property == 'rental') {
        data.isEdit = true;
        data.rental = {
          customer: null,
          movies: [],
          payment: null,
          dueDate: null
        };
      }
      else {
        data[property] = null;
      }
    });
    vm.$on('clearMessages', function(){
      console.log('call clearMessages');
      data.errorMessage = null;
      data.successMessage = null;
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
      app.postEmployee(employee);
    });
    //update employee
    vm.$on('updateEmployee', function(employee) {
      console.log('call updateEmployee '+employee.employeeId);
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
          else if (xhr.status == 404) {
            alert('Sorry we could not a find a customer that matched your search!'); //TODO replace with nicer alert
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
      this.$router.app.$emit('clearMessages'); 
      this.$router.push({ name: 'customerEdit', params: { id: id }});
    });
        //add new customer
    vm.$on('createCustomer', function(customer) {
      console.log('call createCustomer');
      console.log(customer);
      //TODO no employee yet -- need to rework callback
      //var callbackRoute = { name: 'customerView', params: { id: customer.customerId }}; //go to view employee after creation 
      app.postCustomer(customer, null);
    });
    //submit edit customer form
    vm.$on('updateCustomer', function(customer) {
      var callbackRoute = { name: 'customerView', params: { id: customer.customerId }};
      app.postCustomer(customer, callbackRoute);
    });
     //delete customer
    vm.$on('deleteCustomer', function(customer) {
      console.log('call deleteCustomer '+customer.customerId);
      if (!customer.active) {
        this.$router.app.$emit('clearMessages');
      }
      var callbackRoute = { name: 'customerView', params: { id: customer.customerId }};
      app.postCustomer(customer, callbackRoute);
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
          var movies = [];
          movies.push({
            title: copies[0].title,
            upc: copies[0].upc,
            releaseYear: copies[0].releaseYear,
            inStock: copies[0].status == 0
          });
          console.log(movies);
          var lastIndex = 0;
          for (var i = 0; i < copies.length; i++) {
            if (copies[i].upc == movies[lastIndex].upc) {
              //same upc -- check stock
              if (!movies[lastIndex].inStock && parseInt(copies[i].status) == 0) {
                //update stock
                movies[lastIndex].inStock = true;
              }
            }
            else {
              //different upc  -- add to movies
              var movie = {
                  title: copies[i].title,
                  upc: copies[i].upc,
                  releaseYear: copies[i].releaseYear,
                  inStock: copies[i].status == 0
                }
                console.log('new title');
                movies.push(movie);
                lastIndex++;
            }
          }
          console.log(movies);
          data.movies = movies;
        }
        else {
          //TODO error handling
        }
      }
      xhr.send(jsonData);
    });
    //view movie title
    vm.$on('viewMovie', function(movie){
      console.log('call viewMovie '+movie.upc);
      var upc = (""+movie.upc).replace(/\D/g,'');
      var title = movie.title;
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
            //console.log("processing "+i);
            if (stock[i].status == 0) {
              stockCount++;
            }
            copies[i] = {
              id: stock[i].movieId,
              status: stock[i].status
            }
          }
          if (stock.length > 0) {
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
            console.log('finish processing upc search');
            console.log(data.movie);
          }
          else {
            alert('Sorry we cannot find any copies of that movie in the system!');
          }
          //go to view movie page
          var callbackRoute = { name: 'movieView', params: { id: movie.upc }};
          vm.$router.push(callbackRoute);
        }
        else {
          // TODO push an alert error (not found)

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
      var jsonData = JSON.stringify({
        "Title": Title, 
        "ReleaseYear": ReleaseYear, 
        "Genre": null, 
        "Upc": Upc, 
        "Qty": Qty
      });
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
          //vm.$router.push({name:'movieView', params: {id: data.movie.upc}});  //make sure to issue another get request
          vm.$router.$emit('viewMovie', Upc);
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
      console.log('call updateMovie with params:');
      console.log(params);
      //generate list for post
      var MovieList = [];
      if (params.hasEdit) {
        //send entire list
        MovieList = data.movie.copies.slice();
        //iterate
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
        //process deletes
        for (var i=0; i<params.delete.length; i++) {
          var movie = {
            id: params.delete[i],
            status: 2
          };
          MovieList.push(movie);
        }

      }
      var vm = this;
      if (MovieList.length == 0) {
        //only additions
        var qty = data.movie.copiesEdit.length - data.movie.copies.length;
        if (qty > 0) {
          data.movie.qty = qty;
          vm.$router.app.$emit('createMovie');
        }
      }
      else {
        console.log(data.movie);
        console.log(params);
        var Title = data.movie.title;
        var ReleaseYear = data.movie.releaseYear;
        var Upc = data.movie.upc;

        var xhr = new XMLHttpRequest();
        var url = "/api/movieBatch";
        var jsonData = JSON.stringify({
          "Title": Title,
          "ReleaseYear": ReleaseYear,
          "Genre": "","Upc": Upc,
          "MovieList": MovieList
        });
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
          //Call a function when the state changes.
          if(xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            var qty = data.movie.copiesEdit.length - data.movie.copies.length;
            if (qty > 0) {
              data.movie.qty = qty;
              console.log('emit createmovie');
              vm.$router.app.$emit('createMovie');
            }
            else {
              console.log('emit viewmovie '+movie.title);
              vm.$router.app.$emit('viewMovie', data.movie);
            }
          }
          else {
            //TODO error handling
          }
        }
        console.log('POST to '+url);
        console.log(jsonData);
        xhr.send(jsonData);
      }
    });
    //NEW RENTAL
    //new rental 1: select customer
    vm.$on('rentalCustomer', function(customer){
      data.rental.customer = customer;
      UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      console.log(data.rental);
    });
    //undo
    vm.$on('rentalClearCustomer', function(){
      data.rental.customer = null;
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

      var EmployeeId = data.user.employeeId + ""; //to string
      var CustomerId = data.rental.customer.customerId + "";
      var LateFeePaid = data.rental.customer.accountBalance + "";
      var PaymentType = data.rental.payment.type;
      var PaymentCard= data.rental.payment.card;
      var MovieList = [];
      var today = new Date();
      var dueDate = today;
      dueDate.setDate(today.getDate()+1);
      var day = dueDate.getDate();
      var month = dueDate.getMonth() + 1;
      if (day < 10) {
        day = "0"+day;
      }
      if (month < 10) {
        month = "0"+month;
      }
      dueDate = dueDate.getFullYear()+"-"+month+"-"+day;
      for (var i = 0; i<data.rental.movies.length; i++) {
        var movie = {
          id: data.rental.movies[i].movieId+"",
          Cost: "3",
          DueDate: dueDate
        }
        MovieList.push(movie);
      }

      var jsonData = JSON.stringify({
        "EmployeeId": EmployeeId, 
        "CustomerId": CustomerId,
        "LateFeePaid": LateFeePaid, 
        "PaymentType": PaymentType, 
        "PaymentCard": PaymentCard, 
        "MovieList": MovieList
      });
      
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
      var url = "/api/return";
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
    //data.isView = false;
    data.isEdit = false;
    data.isNew = false;
    if (to.fullPath[1] == 'u') {
      //TODO refactor/rename -- it's not really a search
      //send login request -- TODO use a function?
      var url = "/api/employees";
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            //TODO use request.readyState == 4 && request.status == 200, add error handling
            data.employees = JSON.parse(xhr.responseText);
            console.log(data.employees);
            next();
          }
      }; 
      xhr.open('POST', url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send();
    }
    else {
      // go to cust or inventory
      next();
    }
  }
  else if (to.fullPath.indexOf('new') > -1) {
    data.isSingle = true;
    //data.isView = false;
    data.isEdit = true;
    data.isNew = true;
    //data.selected = {};
    //next();
    //probably better as a switch
    if (to.fullPath[1] == 'c') {
      data.customer = {};
      data.customer[addState] = "IL";
      next();
    }
    else if (to.fullPath[1] == 'm') {
      data.movie = {};
      next();
    }
    else if (to.fullPath[1] == 'r') {
      //handle referral from customer
      var rentalCustomer = null;
      //console.log(from.fullPath.indexOf(data.rental.customer.customerId));
      data.rental = {
        customer: rentalCustomer,
        movies: [],
        payment: null,
        dueDate: null
      };
      next();
    }
    else {
      //user
      data.employee = {};
      next();
    }
  }
  else if (to.fullPath.indexOf('edit') > -1) {
    data.isSingle = true;
    data.isEdit = true;
    data.isNew = false;
    next();
  }
  else if (to.fullPath.indexOf('return') > -1) {
    data.isSingle = true;
    //data.isView = false;
    data.isEdit = true;
    data.isNew = true;
    data.return = {
      movies: []
    };
    next();
  }
  else if (to.fullPath.indexOf('reports') > -1) {
    data.reports = {};
    if (to.fullPath.indexOf('overdue') > -1) {
      app.getReport('Overdue');
      next();
    }
    else if (to.fullPath.indexOf('popular') > -1) {
      app.getReport('Popular');
      next();
    }
    else {
      app.getReport('Customer');
      next();
    } 
  }
  else {
    //view or edit obj
    data.isSingle = true;
    data.isEdit = false;
    data.isNew = false;
    next();
  }
});