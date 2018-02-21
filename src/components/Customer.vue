<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew">Create Customer Account</h1>
      <h1 v-else class="uk-text-large" style="position: relative">Customer Account 
        <ul class="uk-iconnav uk-position-top-right">
          <li v-if="data.isEdit"><a href="#" uk-icon="icon: close"></a></li>
          <li v-if="data.isEdit == false"><a href="#" uk-icon="icon: pencil"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <div v-if="data.isEdit">
        EDIT FORM
      </div>
      <div style="position: relative">
        <div v-for="(customer, id) in data.selected" style="position: relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ $route.params.id }}</span>
          <strong>{{ customer.name }}</strong><br />
          <span class="uk-text-small">{{ customer.address }} <br />{{ customer.phone }}</span>
        </div>
        <hr />
        <button class="uk-button uk-button-default">View Rental History</button>
        <button class="uk-button uk-button-default" v-if="data.isManager">View Ledger</button>
      </div>
    </div>
    <div v-else>
      <!--customer search view-->
      <label class="uk-form-label uk-text-large uk-text-muted uk-margin uk-display-block" for="customerKeyword">Find a Customer</label>
      <div class="uk-search uk-search-default uk-width-1-1">
        <input type="search" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input" id="customerKeyword" name="customerKeyword" v-on:keyup.enter="search">  
        <button v-on:click="search" class="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon></button>
        <!--<span class="uk-button uk-button-default"  v-on:click="search">Search</span>-->
      </div>
      <div v-if="data.customers">
        <div class="uk-margin-top">
          <!--
          <h1 class="uk-text-large uk-heading-divider">Customer Search Results <strong>{{ data.query }}</strong></h1>
          -->
          <hr>
          <!--loop over results-->
          <ul class="uk-list uk-list-divider">
            <!--move style to cutom css-->
            <li v-for="(customer, id) in data.customers" style="position: relative" v-on:click="view">
              <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ id }}</span>
              <strong>{{ customer.name }}</strong><br />
              <span class="uk-text-small">{{ customer.address }} <br />{{ customer.phone }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'customer',
    props: ['data'],
    data() {
      return {
        //seed id for new customer
        customerInfo: {
          "199854" : {
            name: "",
            address: "",
            phone: ""
          }
        }
      }
    },
    methods: {
      search() {
        var query = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('searchCustomer', query);
      },
      view(event) {
        console.log(event);
        console.log(event.target.children[0].textContent);
        this.$router.app.$emit('viewCustomer', event.target.children[0].textContent);
      },
      addForm(event) {
        //load form with blank data
      },
      addSubmit(event) {
        //submit form data
      }
    }
  }
</script>