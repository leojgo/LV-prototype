<template>
  <div class="uk-section">
    <div v-if="data.isAuthenticated">
      <h1 class="uk-h2 uk-align-center uk-margin-remove-bottom">Hi {{ data.user }}</h1>
      <p class="uk-text-meta uk-margin-remove-top">You're logged in as a <strong>{{ data.role }}</strong></p>
      <p>Welcome message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

      <div v-if="data.isManager" class="uk-margin">
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Find a Customer</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Manage Users</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
      </div>
      <div v-else class="uk-margin-large">
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Overdue Rentals</button>
      </div>
    </div>
    <form v-else>
      <div class="uk-margin">
        <input class="uk-input" type="text" name="user" placeholder="username">
      </div>
      <div class="uk-margin">
        <input class="uk-input" type="text" name="password" placeholder="********">
      </div>
      <button class="uk-button uk-button-default" type="submit" v-on:click="login">Login</button>
    </form>
  </div>
</template>
<script>
  export default {
    props: ['data'],
    methods: { 
      login(user) {
        console.log(user);
      }
    }
  }
</script>