<template>
  <header>
    <div class="uk-background-secondary uk-light uk-padding-small uk-text-meta uk-text-right"  v-if="data.isAuthenticated">
      <div class="uk-container">
        <span uk-icon="icon: user"></span>{{ data.user.name }} | <span v-on:click="logout" >log out</span>
      </div>
    </div>
    <nav class="uk-navbar-container uk-container" uk-navbar>
      <div class="uk-navbar-left uk-visible@s">
        <a href="/" class="uk-navbar-item uk-logo" is="router-link" to="/">
          {{ data.company }}
        </a>
      </div>
      <div class="uk-navbar-center uk-hidden@s">
        <a href="/" class="uk-navbar-item uk-logo" is="router-link" to="/">
          {{ data.company }}
        </a>
      </div>
      <div class="uk-navbar-right">
        <a class="uk-navbar-toggle uk-hidden@s" href="#mobilePrimary" uk-toggle>
          <span uk-navbar-toggle-icon v-if="data.isAuthenticated"></span>
        </a>
        <ul class="uk-navbar-nav uk-visible@s" v-if="data.isAuthenticated">
          <li v-if="data.isManager">
              <a href="/users">Users</a>
          </li>
          <li>
              <a href="#">Rentals</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a is="router-link" to="/rentals/new">New Rental</a></li>
                      <li><a is="router-link" to="/rentals/return">Return Rental</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Movies</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a is="router-link" to="/movies/search">Search Movies</a></li>
                      <li><a is="router-link" to="/movies/new">New Movie</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Customers</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a is="router-link" to="/customers/search" v-on:click.native="clearSearch">Search Customers</a></li>
                      <li><a is="router-link" to="/customers/new">New Customer</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Reports</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a is="router-link" to="/reports/overdue">Overdue Rentals</a></li>
                      <li><a is="router-link" to="/reports/popular">Popular Movies</a></li>
                      <li><a is="router-link" to="/frequentCustomers">Frequent Customers</a></li>
                  </ul>
              </div>
          </li>
        </ul>
      </div>
    </nav>
    <div id="mobilePrimary" uk-offcanvas="mode: push; overlay: true; flip: true" v-if="data.isAuthenticated">
      <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <ul class="uk-nav uk-nav-default">
          <li v-if="data.isManager"><a href="/users">Users</a></li>
          <li class="uk-nav-header">Rentals</li>
          <li><a href="#">New Rental</a></li>
          <li><a href="#">Return Rental</a></li>
          <li class="uk-nav-header">Movies</li>
          <li><a is="router-link" to="/customers/search" v-on:click.native="clear('customers')">Search Movies</a></li>
          <li><a href="#">Add New Movie</a></li>
          <li class="uk-nav-header">Customers</li>
          <li><a is="router-link" to="/customers">Search Customers</a></li>
          <li><a href="#">Add New Customer</a></li>
          <li class="uk-nav-header">Reports</li>
          <li><a href="#">Overdue Rentals</a></li>
          <li><a href="#">Popular Movies</a></li>
          <li><a href="#">Frequent Customers</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    props: ['data'],
    methods: {
      logout() {
        console.log('emit logout event');
        this.$router.app.$emit('logout');
      },
      clearSearch() {
        console.log('emit clear on search');
        this.$router.app.$emit('clear', 'customers');
      }
    }
  }
</script>