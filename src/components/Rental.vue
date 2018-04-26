<template>
  <div class="uk-section">
    <!--single view-->
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
                <li v-for="movie in data.rental.movies" class="uk-position-relative">{{ movie.movieId }} <strong>{{ movie.title }}</strong><span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem(movie.movieId)"></span></li>
              </ul>
              <div class="uk-inline uk-margin uk-width-1-1">
                <input class="uk-input" type="text" name="addCopy" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')" v-on:keyup.enter="addToRental"><span class="uk-form-icon uk-form-icon-flip"  uk-icon="icon: plus-circle" v-on:click="addToRental"></span>
              </div>
              <button class="uk-button uk-button-primary" v-on:click="openPayment" v-if="hasMovies">Continue to Payment</button>
            </div>
          </li>
          <li id="rentalPayment">
            <a class="uk-accordion-title" href="#" v-bind:class="{'uk-disabled' : !hasMovies }"><span class="uk-label" v-bind:class="{'uk-label-success' : data.rental.payment != null}">3</span> Payment &amp; Confirmation</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div uk-grid>
                <div class="uk-width-1-2@">
                  Rental Fee: ${{ rentalFee }}<br />
                  <!--Outstanding Late Fee: ${{ lateFee }}<br />-->
                  Total Fee: ${{ totalFee }}
                </div>
                <div class="uk-width-1-2@s uk-form-controls">
                  <select class="uk-select" id="form-stacked-select" v-on:change="changePayment">
                    <option disabled selected>Select Payment Type</option>
                    <option value="cash">Cash Payment</option>
                    <option value="credit" >Credit Card</option>
                    <option value="debit" >Debit Card</option>
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
        <div>
          <strong>Confirmation Number</strong>: {{ data.rental.confirmation }}<br />
          <strong>Total Paid</strong>: ${{ totalFee }}<br />
          <strong>Payment Type</strong>: {{ data.rental.payment.type }} <span v-if="data.rental.payment.type != 'cash'">({{ data.rental.payment.digits }})</span><br />
          <strong>Payment Date</strong>: {{ data.rental.payment.date }}
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Customer</h2>
        <div class="uk-position-relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-large-right">{{ data.rental.customer.customerId }}</span> <strong>{{ data.rental.customer.nameFirst }} {{ data.rental.customer.mameLast }}</strong><br />
          <span class="uk-text-small">{{ data.rental.customer.addLine1 }}, {{ data.rental.customer.addCity }}, {{ data.rental.customer.addState }} {{ data.rental.customer.addZip }}<br />{{ data.rental.customer.phoneNumber }}</span>
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Items Rented</h2>
        <ul class="uk-list uk-list-divider">
          <li v-for="movie in data.rental.movies" class="uk-position-relative">{{ movie.movieId }} <strong>{{ movie.title }}</strong></li>
        </ul>
      </div>
    </div>
    <div v-else-if="$route.params.id == 'return'">
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Return Rentals</h1>
      <h1 v-else class="uk-text-large uk-text-muted">Return Rentals Confirmation</h1>
      <div class="" v-if="data.isNew" >
        <ul v-if="data.return.movies.length > 0" class="uk-list uk-list-divider">
          <li v-for="movie in data.return.movies" class="uk-position-relative">
              {{ movie.movieId }} <strong>{{ movie.title }}</strong>
              <span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem(movie.movieId)"></span>
          </li>
        </ul>
        <div class="uk-inline uk-margin uk-width-1-1">
          <input class="uk-input" type="text" name="addReturn" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.getCopy }" v-on:focus="clearError('addReturn')" v-on:keyup.enter="addToReturn"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToReturn"></a>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary" v-on:click="submitReturn" v-if="isReturnComplete">Submit</button>
        </div>
      </div>
      <div v-else>
        <div >
          <div class="uk-alert uk-alert-success">
            <p><strong>Thank you!</strong> Your return has been processed.</p>
          </div>
        </div>
        <h2 class="uk-heading-divider uk-text-small uk-text-bold">Items Returned</h2>
        <ul class="uk-list uk-list-divider">
          <li v-for="movie in data.return.movies" class="uk-position-relative">{{ movie.movieId }} <strong>{{ movie.title }}</strong></li>
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
        paymentType: null,
        isCard: false,
        hasDigits: false,
        //rentalFee: 0,
        //lateFee: 6,
        errors: {
          addCopy: false,
          addCardDigits: false,
          addReturn: false
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
        this.$router.app.$emit('rentalClearCustomer');
        //this.$router.app.$emit('searchCustomer', this.customerQuery); //restore previous search
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      },
      clearItem(id){
        console.log('emit clearItem '+id);
        this.$router.app.$emit('clearItem', id);
      },
      addToRental() {
        //TODO refactor
        var copy = document.querySelector("input[name=addCopy]");
        //validate input data
        var copyId = copy.value.replace(/\D/g,'');
        if (copy.value == copyId) {
          console.log('emit rentalAddMovie');
          this.$router.app.$emit('rentalAddMovie', copyId);
          copy.value = "";
          copy.placeholder = "Add another movie..."; //change to computed property
        }
        else {
          this.errors.addCopy = true
        }
      },
      addToReturn(){
        var copy = document.querySelector("input[name=addReturn]");
        var copyId = copy.value.replace(/\D/g,'');
        if (copy.value == copyId) {
          console.log('emit returnAddMovie');
          this.$router.app.$emit('returnAddMovie', copyId);
          copy.value = "";
          copy.placeholder = "Add another movie..."; //change to computed property
        }
        else {
          this.errors.addReturn = true
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
        this.paymentType = event.target.value;
        if (this.paymentType != "cash") {
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
        var digits = event.target.value;
        digits.replace(/\D/g);
        console.log(digits);
        if (digits.indexOf('undefined') == -1) {
          event.target.value = digits;
          console.log('valid card')
          if (digits.length == 4) {
            this.hasDigits = true;
            this.hasPayment = true;
          }
          else {
            this.hasDigits = false;
            this.hasPayment = false;
          }
        }
        else {
          console.log('card not valid!')
          this.hasDigits = false;
          this.hasPayment = false;
        }
      },
      submitNew(rental) {
        var payment = {};
        payment.type = this.paymentType;
        payment.digits = null;
        if (this.isCard) {
          payment.digits = document.getElementById('cardDigits').value;
        }
        rental.payment = payment;
        console.log(rental);
        console.log('emit rentalNew');
        this.$router.app.$emit('rentalNew', rental); 
      },
      submitReturn() {
        var movies = this.$router.app.data.return.movies.slice(0);
        for (var i=0; i<movies.length; i++) {
          movies[i] = {
            Id: movies[i].movieId
          }
        }
        console.log(movies);
        this.$router.app.$emit('rentalReturn', movies);
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
          return this.$router.app.data.rental.customer.accountBalance + (this.$router.app.data.rental.movies.length * 3);
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
        return this.$router.app.data.return.movies.length > 0;
      },
      dueDate: function() {
        var d = new Date();
        return (d.getMonth()+1)+ "/" + (d.getDate()+1) + "/" + d.getFullYear();
        //sim for any date other than last day of month
      }
    }
  }
</script>