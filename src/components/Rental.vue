<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">New Rental</h1>
      <h1 v-else class="uk-text-large  uk-text-muted uk-position-relative">Return Rental</h1> 
      <!--maybe can combine-->
      <div class="uk-form uk-padding" uk-grid @submit.prevent="handleSubmit">
        <ul uk-accordion="multiple: true" v-if="data.isNew" class="uk-width-1-1" id="newRental">
          <li class="uk-open">
            <a class="uk-accordion-title" href="#">
              <span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.customer}">1</span> Customer
            </a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div v-if="customer === null">
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
                      <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ id }}</span>
                      <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
                      <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else v-for="(customer, id) in data.selected.customer" class="uk-position-relative">
                <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ id }}</span>
                <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
                <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
              </div>
            </div>
          </li>
          <li>
            <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.movies }">2</span> Movies</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div v-if="movies != null" v-for="(movie, id) in data.selected.movies">
                {{ id }} <strong>{{ movie.title }}</strong>
              </div>
              <div class="uk-inline uk-margin uk-width-1-1">
                <input class="uk-input" type="text" name="addCopy" placeholder="Add movie item ID" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToCopies"></a>
              </div>
            </div>
          </li>
          <li>
            <a class="uk-accordion-title" href="#"><span class="uk-label" v-bind:class="{'uk-label-success' : data.selected.paymentType}">3</span> Payment</a>
            <div class="uk-accordion-content uk-padding uk-margin-small-left" style="border-left:1px solid">
              <div uk-grid>
              <div class="uk-width-1-2@s uk-form-controls">
                <select class="uk-select" id="form-stacked-select">
                  <option>Cash Payment</option>
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                </select>
              </div>
              <div class="uk-width-1-2@s">
                <input class="uk-input" type="text" name="cardDigits" placeholder="Last 4 Digits" v-bind:class="{ 'uk-form-danger' : errors.cardDigits }" v-on:focus="clearError('cardDigits')" v-model="data.selected.cardDigits">
              </div>
              <div class="uk-width-1-1">
                <button class="uk-button uk-button-primary">Save</button>
                <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit">Cancel</span>
              </div>
            </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <!--customer search view-->
      <label class="uk-form-label uk-text-large uk-text-muted uk-margin uk-display-block" for="customerKeyword">Find a Customer</label>
      <div class="uk-search uk-search-default uk-width-1-1">
        <input type="search" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input" id="customerKeyword" name="customerKeyword" v-on:keyup.enter="searchCustomer">  
        <button v-on:click="searchCustomer" class="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon></button>
        <!--<span class="uk-button uk-button-default"  v-on:click="search">Search</span>-->
      </div>
      <div v-if="data.customers" class="uk-margin-top">
        <!--
        <h1 class="uk-text-large uk-heading-divider">Customer Search Results <strong>{{ data.query }}</strong></h1>
        -->
        <hr>
        <!--loop over results-->
        <ul class="uk-list uk-list-divider">
          <!--move style to cutom css-->
          <li v-for="(customer, id) in data.customers" style="position: relative" v-on:click="view(id)">
            <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ id }}</span>
            <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
            <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
          </li>
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
        customer: null,
        movies: null,
        paymentType: null,

        errors: {
          addCopy: false
        }
      }
    },
    methods: {
      searchCustomer() {
        var query = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('searchCustomer', query);
      },
      selectCustomer(id) {
        this.customer = id;
        this.$router.app.$emit('searchCustomer',id);
        this.$router.app.$emit('rentalCustomer', id);
        UIkit.accordion(document.getElementById('newRental')).toggle(1, true);
      },
      addToCopies() {
        var copy = document.querySelector("input[name=addCopy]");
        //validate input data
        var copyId = copy.value.replace(/\D/g,'');
        if (copy.value == copyId && copyId.length == 10) {
          if (this.movies === null) {
            this.movies = [copy.value];
          }
          else {
            this.movies.push(copy.value);
          }
          //add to rental copies
        }
        else {
          this.errors.addCopy = true
        }
      },
      clearError() {

      },
      cancelEdit() {

      }
    }
  }
</script>