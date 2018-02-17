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
      <div v-if="data.customers">
        <div>
          <div>
            <h1 class="uk-text-large">Search Results</h1>
            <!--loop over results-->
            <ul v-for="customer in data.customers">
              <li>
                {{ customer.id }}
                {{ customer.name }}
                {{ customer.phone }}
                {{ customer.address }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else >
        <label class="uk-form-label">Find a Customer</label>
        <input type="text" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input uk-margin-bottom">  
        <span class="uk-button uk-button-default"  v-on:click="search">Search</span>
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
        edit: false
      }
    },
    methods: {
      search() {
        console.log('emit customer search event');
        this.$router.app.$emit('customerSearch', "Johnson");
      }
    }
  }
</script>