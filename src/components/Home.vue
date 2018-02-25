<template>
  <div class="uk-section">
    <div v-if="data.isAuthenticated">
      <!--DASHBOARD-->
      <h1 class="uk-h2 uk-align-center uk-margin-remove-bottom">Hi {{ data.user.name }}</h1>
      <p class="uk-text-meta uk-margin-remove-top">You're logged in as a <strong>{{ data.user.role }}</strong></p>
      <p>Welcome message lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      <div v-if="data.isManager" class="uk-margin">
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" >Find a Customer</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Manage Users</button>
        <button is="router-link" to="/rentals/new" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
      </div>
      <div v-else class="uk-margin-large">
        <button is="router-link" to="/rentals/new" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Overdue Rentals</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'home',
    props: ['data'],
  }
</script>