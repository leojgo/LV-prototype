<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Customer Account</h1>
      <h1 v-else class="uk-text-large" style="position: relative">Customer Account 
        <ul class="uk-iconnav uk-position-top-right">
          <li v-if="data.isEdit"><a href="#" uk-icon="icon: close"></a></li>
          <li v-if="data.isEdit == false"><a href="#" uk-icon="icon: pencil"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <div v-if="data.isEdit" class="uk-form" uk-grid>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" placeholder="John" :value="data.selected.name">
        </div>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" placeholder="Smith" :value="data.selected.name">
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" placeholder="Address Line">
        </div>
        <!--City/State: assume all local addresses-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" placeholder="City">
        </div>
        <div class="uk-width-1-2@s">
          <div class="uk-form-controls">
            <select class="uk-select" id="form-stacked-select">
                <option>Alabama</option>
                <option>Alaska</option>
                <option>Illinois</option>
                <option>Wisconsin</option>
            </select>
          </div>
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-1">
            <!--add label-->
            <input class="uk-input" type="text" placeholder="800-588-2300">
            <!--add help text-->
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" placeholder="you@example.com">
        </div>
        <div class="uk-width-1-1">
          <label><input class="uk-checkbox" type="checkbox" checked> Add to Mailing List</label>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <button class="uk-button uk-button-default uk-margin-left">Cancel</button>
        </div>
      </div>
      <div v-else style="position: relative">
        <!--view only-->
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
            <strong>{{ customer.name }}</strong><br />
            <span class="uk-text-small">{{ customer.address }} <br />{{ customer.phone }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'customer',
    props: ['data'],
    methods: {
      search() {
        var query = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('searchCustomer', query);
      },
      view(id) {
        this.$router.app.$emit('viewCustomer',id);
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