<template>
  <div class="uk-section">
    <div v-if="single">
      <!--single customer view-->
      <div>
        <input type="text" name="first" placeholder="John" />
        <input type="text" name="last" placeholder="Smith" />
        <input type="text" name="first" placeholder="John" />
      </div>
    </div>
    <div v-else>
      <!--customer search view-->
      
      <div>
        <label class="uk-form-label">Find a Customer</label>
        <input type="text" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input uk-margin" v-model="query" name="customerKeyword">  
        <span class="uk-button uk-button-default"  v-on:click="search">Search</span>
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
            <li v-for="customer in data.customers" style="position: relative">
              <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-top">{{ customer.id }}</span>
              <strong>{{ customer.name }}</strong><br />
              <span class="uk-small">{{ customer.address }} <br />{{ customer.phone }}</span>
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
    props: ['data','single','new'],
    data() {
      return {
        edit: false,
        query: ""
      }
    },
    methods: {
      search() {
        var query = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('customerSearch', query);
      }
    }
  }
</script>