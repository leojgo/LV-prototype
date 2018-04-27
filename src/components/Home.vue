<template>
  <div class="uk-section">
    <div v-if="data.isAuthenticated">
      <!--DASHBOARD-->
      <h1 class="uk-h2 uk-align-center uk-margin-remove-bottom">Hi {{ data.user.firstName }}</h1>
      <p class="uk-text-meta uk-margin-remove-top">You're logged in as a <strong>{{ data.user.employeeTitle }}</strong></p>
      <p v-if="data.isManager">European badgers also tend to travel on well-worn trails, some of which have been in use for hundreds of years.</p>
      <p v-else>Badgers are small mammals in the family Mustelidae, which also includes the otters, polecats, weasels and wolverines.</p>
      <div v-if="data.isManager" class="uk-margin">
        <button is="router-link" to="/customers/search" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom" >Find a Customer</button>
        <button is="router-link" to="/users/search" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Manage Users</button>
        <button is="router-link" to="/rentals/new" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button is="router-link" to="/rentals/return" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
      </div>
      <div v-else class="uk-margin-large">
        <button is="router-link" to="/rentals/new" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Start a Rental</button>
        <button is="router-link" to="/rentals/return" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Return a Rental</button>
        <button is="router-link" to="/reports/overdue" class="uk-button uk-button-default uk-width-1-1 uk-margin-small-bottom">Overdue Rentals</button>
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