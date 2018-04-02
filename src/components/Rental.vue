<template>
  <div class="uk-section">
    <!--single customer view-->
    <div class="uk-alert-danger uk-text-small" uk-alert>
      <!--<a class="uk-alert-close" uk-close></a>-->
      <p>Prototyope for placement only -- not for functional review!</p>
    </div>
    <div v-if="$route.params.id == 'new'">
      <h1 class="uk-text-large uk-text-muted" v-if="data.isEdit">New Rental</h1>
      <h1 class="uk-text-large uk-text-muted" v-else>New Rental Confirmation</h1>
      <!--{{ rental }}-->
      <div class="uk-form uk-padding" uk-grid v-if="data.isEdit">
        <ul uk-accordion="multiple: true; collapsible:false" v-if="data.isNew" class="uk-width-1-1" id="newRental">
          <li class="uk-open" id="rentalCustomer">
            <a class="uk-accordion-title" href="#">
              <span class="uk-label" v-bind:class="{'uk-label-success' : hasCustomer }">1</span> Customer
            </a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div v-if="!hasCustomer">
                <div class="uk-search uk-search-default uk-width-1-1">
                  <input type="search" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input" id="customerKeyword" name="customerKeyword" v-on:keyup.enter="searchCustomer">  
                  <button v-on:click="searchCustomer" class="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon></button>
                </div>
                <div v-if="data.customers" class="uk-margin-top">
                  <hr>
                  <!--loop over results-->
                  <ul class="uk-list uk-list-divider">
                    <!--move style to cutom css-->
                    <li v-for="customer in data.customers" style="position: relative" v-on:click="selectCustomer(customer)">
                      <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top uk-margin-large-right">{{ customer.customerId }}</span>
                      <strong>{{ customer.nameFirst }} {{ customer.nameLast }}</strong><br />
                      <span class="uk-text-small">{{ customer.addLine1 }}, {{ customer.addCity }}, {{ customer.addState }} {{ customer.addZip }}<br />{{ customer.phoneNumber }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else class="uk-position-relative">
                <span uk-icon="trash" class="uk-position-top-right" v-on:click="clearCustomer"></span>
                <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-large-right">{{ data.rental.customer.customerId }}</span> <strong>{{ data.rental.customer.nameFirst }} {{ data.rental.customer.nameLast }}</strong><br />
                <span class="uk-text-small">{{ data.rental.customer.addLine1 }}, {{ data.rental.customer.addCity }}, {{ data.rental.customer.addState }} {{ data.rental.customer.addZip }}<br />{{ data.rental.customer.phoneNumber }}</span>
              </div>
            </div>
          </li>
          <li id="rentalMovies">
            <a class="uk-accordion-title" href="#" v-bind:class="{'uk-disabled' : !hasCustomer }"><span class="uk-label" v-bind:class="{'uk-label-success' : hasMovies}">2</span> Movies</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <ul class="uk-list uk-list-divider" v-if="data.rental.movies.length > 0">
                <li v-for="movie in data.rental.movies" class="uk-position-relative">{{ movie.movieId }} <strong>{{ movie.title }}</strong><span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem"></span></li>
              </ul>
              <div class="uk-inline uk-margin uk-width-1-1">
                <input class="uk-input" type="text" name="addCopy" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')" v-on:keyup.enter="addToCopies"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToCopies"></a>
              </div>
              <button class="uk-button uk-button-primary" v-on:click="openPayment" v-if="hasMovies">Continue to Payment</button>
            </div>
          </li>
          <li id="rentalPayment">
            <a class="uk-accordion-title" href="#" v-bind:class="{'uk-disabled' : !hasMovies }"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.paymentType}">3</span> Payment &amp; Confirmation</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div uk-grid>
                <div class="uk-width-1-2@">
                  Rental Fee: ${{ rentalFee }}<br />
                  Outstanding Late Fee: ${{ lateFee }}<br />
                  Total Fee: ${{ totalFee }}
                </div>
                <div class="uk-width-1-2@s uk-form-controls">
                  <select class="uk-select" id="form-stacked-select" v-on:change="changePayment">
                    <option disabled selected>Select Payment Type</option>
                    <option value="0">Cash Payment</option>
                    <option value="1" >Credit Card</option>
                    <option value="2" >Debit Card</option>
                  </select>
                </div>
                <div class="uk-width-1-2@s" v-if="isCard">
                  <input class="uk-input" type="text" id="cardDigits" name="cardDigits" placeholder="Enter card number last 4 digits" v-bind:class="{ 'uk-form-danger' : errors.cardDigits }" v-on:focus="clearError('cardDigits')" v-on:keyup="validateDigits">
                </div>
                <div class="uk-width-1-1" v-if="isComplete">
                  <button class="uk-button uk-button-primary" v-on:click="submitNew(data.rental)">Submit</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <div v-for="rental in data.selected" >
          <strong>Confirmation Number</strong>: 9874668792983479<br />
          <strong>Due date</strong>: {{ dueDate }}<br />
          <strong>Total Paid</strong>: ${{ totalFee }}<br />
          <strong>Payment Type</strong>: Credit Card ({{ rental.payment.digits }})
          <hr />
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Customer</h2>
        <div v-for="(customer, id) in rental.customer" class="uk-position-relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-large-right">{{ id }}</span> <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
          <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Items Rented</h2>
        <ul class="uk-list uk-list-divider">
          <li v-for="movie in rental.movies" class="uk-position-relative">{{ movie.id }} <strong>{{ movie.title }}</strong></li>
        </ul>
      </div>
    </div>
    <div v-else-if="$route.params.id == 'return'">
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Return Rental</h1>
      <h1 v-else class="uk-text-large uk-text-muted">Return Rental Confirmation</h1>
      <ul uk-accordion="multiple: true; collapsible:false" v-if="data.isNew" class="uk-width-1-1" id="newRental">
        <li id="rentalMovies">
          <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.movies }">1</span> Movies</a>
          <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
            <ul v-if="rental.movies.length > 0" class="uk-list uk-list-divider">
              <li v-for="movie in rental.movies" class="uk-position-relative">{{ movie.id }} <strong>{{ movie.title }}</strong>
                <span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-large-right">2 Days Overdue</span>
                <span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem"></span></li>
            </ul>
            <div class="uk-inline uk-margin uk-width-1-1">
              <input class="uk-input" type="text" name="addCopy" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')" v-on:keyup.enter="addToCopies"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToCopies"></a>
            </div>
            <button class="uk-button uk-button-primary" v-on:click="openReturnPayment" v-if="showPaymentButton">Continue to Payment &amp; Confirmation</button>
          </div>
        </li>
        <li id="rentalPayment">
          <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.paymentType}">2</span> Payment &amp; Confirmation</a>
          <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
            <div uk-grid>
              <div class="uk-width-1-2@">
                Late Fee: ${{ lateFee }}
              </div>
              <div class="uk-width-1-2@s uk-form-controls">
                <select class="uk-select" id="form-stacked-select" v-on:change="changePayment">
                  <option disabled selected>Select Payment Type</option>
                  <option value="0">Cash Payment</option>
                  <option value="1" >Credit Card</option>
                  <option value="2" >Debit Card</option>
                </select>
              </div>
              <div class="uk-width-1-2@s" v-if="isCard">
                <input class="uk-input" type="text" id="cardDigits" name="cardDigits" placeholder="Enter card number last 4 digits" v-bind:class="{ 'uk-form-danger' : errors.cardDigits }" v-on:focus="clearError('cardDigits')" v-on:keyup="validateDigits">
              </div>
              <div class="uk-width-1-1">
                <button class="uk-button uk-button-primary" v-on:click="submitReturn" v-if="isReturnComplete">Submit</button>
                <button class="uk-button uk-button-default" v-on:click="submitReturn">Skip Payment</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <div v-for="rental in data.selected" >
          <strong>Confirmation Number</strong>: 9874668792983479<br />
          <strong>Date</strong>: {{ rental.payment.date }}<br />
          <strong>Total Paid</strong>: ${{ lateFee }}<br />
          <strong>Payment Type</strong>: Credit Card ({{ rental.payment.digits }})
          <hr />
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Items Rented</h2>
        <ul class="uk-list uk-list-divider">
          <li v-for="movie in rental.movies" class="uk-position-relative">{{ movie.id }} <strong>{{ movie.title }}</strong></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'rental',
    props: ['data'],
    data() {
      return {
        customerQuery: '',
        //hasCustomer: false,
        //hasMovies: false,
        hasPayment: false,
        paymentVisible: false,
        showPaymentButton: false,
        isCard: false,
        hasDigits: false,
        //rentalFee: 0,
        //lateFee: 6,
        errors: {
          addCopy: false,
          addCardDigits: false
        }
      }
    },
    methods: {
      searchCustomer() {
        this.customerQuery = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('searchCustomer', this.customerQuery);
      },
      selectCustomer(customer) {
        this.$router.app.$emit('rentalCustomer', customer);
      },
      clearCustomer() {
        //TODO refactor
        //this.hasCustomer = false;
        //document.querySelector("input[name=customerKeyword]").value = this.customerQuery;
        this.$router.app.$emit('searchCustomer', this.customerQuery); //restore previous search
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      },
      clearItem(){

      },
      addToCopies() {
        //TODO refactor
        var copy = document.querySelector("input[name=addCopy]");
        //validate input data
        var copyId = copy.value.replace(/\D/g,'');
        if (copy.value == copyId) {
          this.$router.app.$emit('rentalAddMovie', copyId);
          copy.value = "";
          copy.placeholder = "Add another movie..."; //change to computed property
          //this.rentalFee += 3; //change to computed property
          /*
          if (this.hasMovies && !this.paymentVisible) {
            this.showPaymentButton = true;
          }*/
        }
        else {
          this.errors.addCopy = true
        }
      },
      openPayment() {
        UIkit.accordion(document.getElementById('newRental')).toggle(2, true);
        this.paymentVisible = true;
        this.showPaymentButton = false;
      },
      openReturnPayment() {
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
        this.paymentVisible = true;
        this.showPaymentButton = false;
      },
      changePayment(event) {
        if (event.target.value != "0") {
          this.isCard = true;
          if (this.hasDigits) {
            this.hasPayment = true;
          }
          else {
            this.hasPayment = false;
          }
        }
        else {
          this.isCard = false;
          this.hasPayment = true;
        }
      },
      validateDigits(event) {
        var digits = event.target.value.replace(/\D/g);
        event.target.value = digits;
        if (digits.length == 4) {
          this.hasDigits = true;
          this.hasPayment = true;
        }
        else {
          this.hasDigits = false;
          this.hasPayment = false;
        }
      },
      submitNew(rental) {
        var payment = {};
        var dueDate = new Date();
        dueDate.setDate(today.getDate()+1);
        payment.type = document.getElementById('form-stacked-select').value;
        payment.digits = document.getElementById('cardDigits').value;
        rental.payment = payment;
        rental.dueDate = dueDate;
        this.$router.app.$emit('rentalSubmit', rental); 
      },
      submitReturn(payment) {
        //TODO change return logic to allow skipped payments
        if (payment) {

        }
        else {

        }
        //prototype fn for payment submit
        var payment = {};
        var d = new Date();
        payment.rentalFee = 0;
        payment.totalFee = this.lateFee;
        payment.date = (d.getMonth()+1)+ "/" + d.getDate() + "/" + d.getFullYear(); //should be a date object
        payment.type = document.getElementById('form-stacked-select').value;
        payment.digits = document.getElementById('cardDigits').value;
        console.log('emit rental return');
        this.$router.app.$emit('rentalReturn', payment); 
      },
      clearError() {

      },
      cancelEdit() {

      }
    },
    computed: {
      hasCustomer: function() {
        return this.$router.app.data.rental.customer != null;
      },
      hasMovies: function() {
        return this.$router.app.data.rental.movies.length > 0;
      },
      rentalFee: function() {
        return this.$router.app.data.rental.movies.length * 3;
      },
      lateFee: function() {
        if (this.$router.app.data.rental.customer != null) {
          return this.$router.app.data.rental.customer.accountBalance;
        }
        else {
          return 0;
        }
      },
      totalFee: function() {
        if (this.$router.app.data.rental.customer != null) {
          return this.$router.app.data.rental.customer.accountBalance + (return this.$router.app.data.rental.movies.length * 3);
        }
        else {
          return this.$router.app.data.rental.movies.length * 3;
        }
      },
      isComplete: function() {
        if (!this.hasCustomer) {
          return false;
        }
        else if (!this.hasMovies) {
          return false;
        }
        else if (!this.hasPayment) {
          return false;
        }
        return true;
      },
      isReturnComplete: function() {
        return this.hasPayment;
      },
      dueDate: function() {
        var d = new Date();
        return (d.getMonth()+1)+ "/" + (d.getDate()+1) + "/" + d.getFullYear();
        //sim for any date other than last day of month
      }
    }
  }
</script>