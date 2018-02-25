<template>
  <div class="uk-section">
    <!--single customer view-->
    <div v-if="$route.params.id == 'new'" v-for="(rental, id) in data.selected">
      <h1 class="uk-text-large uk-text-muted">New Rental</h1>
      <!--{{ rental }}-->
      <div class="uk-form uk-padding" uk-grid @submit.prevent="handleSubmit">
        <ul uk-accordion="multiple: true; collapsible:false" v-if="data.isNew" class="uk-width-1-1" id="newRental">
          <li class="uk-open" id="rentalCustomer">
            <a class="uk-accordion-title" href="#">
              <span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.customer}">1</span> Customer
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
                    <li v-for="(customer, id) in data.customers" style="position: relative" v-on:click="selectCustomer(id)">
                      <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top uk-margin-large-right">{{ id }}</span>
                      <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
                      <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else v-for="(customer, id) in rental.customer" class="uk-position-relative">
                <span uk-icon="trash" class="uk-position-top-right" v-on:click="clearCustomer"></span>
                <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-large-right">{{ id }}</span> <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
                <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
              </div>
            </div>
          </li>
          <li id="rentalMovies">
            <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.movies }">2</span> Movies</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <ul v-if="rental.movies.length > 0" class="uk-list uk-list-divider">
                <li v-for="movie in rental.movies" class="uk-position-relative">{{ movie.id }} <strong>{{ movie.title }}</strong><span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem"></span></li>
              </ul>
              <div class="uk-inline uk-margin uk-width-1-1">
                <input class="uk-input" type="text" name="addCopy" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')" v-on:keyup.enter="addToCopies"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToCopies"></a>
              </div>
              <button class="uk-button uk-button-primary" v-on:click="openPayment" v-if="showPaymentButton">Continue to Payment</button>
            </div>
          </li>
          <li id="rentalPayment">
            <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.paymentType}">3</span> Payment</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div uk-grid>
              <div class="uk-width-1-2@s uk-form-controls">
                <select class="uk-select" id="form-stacked-select" v-on:change="changePayment">
                  <option disabled selected>Select Payment Type</option>
                  <option value="0">Cash Payment</option>
                  <option value="1" >Credit Card</option>
                  <option value="2" >Debit Card</option>
                </select>
              </div>
              <div class="uk-width-1-2@s" v-if="isCard">
                <input class="uk-input" type="text" name="cardDigits" placeholder="Last 4 Digits" v-bind:class="{ 'uk-form-danger' : errors.cardDigits }" v-on:focus="clearError('cardDigits')" v-on:keyup="validateDigits">
              </div>
              <div class="uk-width-1-1" v-if="isComplete">
                <button class="uk-button uk-button-primary">Save</button>
              </div>
            </div>
            </div>
          </li>
        </ul>
        <div>
          
        </div>
      </div>
    </div>
    <div v-else-if="$route.params.id == 'return'">
      <h1>Return Rental</h1>
    </div>
    <div v-else>
      <h1>Success</h1>
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
        hasCustomer: false,
        hasMovies: false,
        hasPayment: false,
        paymentVisible: false,
        showPaymentButton: false,
        isCard: false,
        hasDigits: false,
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
      selectCustomer(id) {
        this.hasCustomer = true;
        this.$router.app.$emit('searchCustomer',id);
        this.$router.app.$emit('rentalCustomer', id);
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      },
      clearCustomer() {
        this.hasCustomer = false;
        //document.querySelector("input[name=customerKeyword]").value = this.customerQuery;
        this.$router.app.$emit('searchCustomer', this.customerQuery); //restore previous search
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      },
      clearItem(){

      },
      addToCopies() {
        var copy = document.querySelector("input[name=addCopy]");
        //validate input data
        var copyId = copy.value.replace(/\D/g,'');
        if (copy.value == copyId && copyId.length == 10) {
          this.hasMovies = true;
          this.$router.app.$emit('rentalAddMovie', copyId);
          copy.value = "";
          copy.placeholder = "Add another movie...";
          if (this.hasMovies && !this.paymentVisible) {
            this.showPaymentButton = true;
          }
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
      clearError() {

      },
      cancelEdit() {

      }
    },
    computed: {
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
      }
    }
  }
</script>