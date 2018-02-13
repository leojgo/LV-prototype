<template>
  <header>
    <div class="uk-background-secondary uk-light uk-padding-small uk-text-meta uk-text-right">
      <span uk-icon="icon: user"></span>{{ data.user }} | <a href="#">log out</a>
    </div>
    <nav class="uk-navbar-container" uk-navbar>
      <div class="uk-navbar-left uk-visible@s">
        <a href="" class="uk-navbar-item uk-logo">
          {{ data.company }}
        </a>
      </div>
      <div class="uk-navbar-center uk-hidden@s">
        <a href="" class="uk-navbar-item uk-logo">
          {{ data.company }}
        </a>
      </div>
      <div class="uk-navbar-right">
        <a class="uk-navbar-toggle uk-hidden@s" href="#mobilePrimary" uk-toggle>
          <span uk-navbar-toggle-icon></span>
        </a>
        <ul class="uk-navbar-nav uk-visible@s">
          <li>
              <a href="#">Rentals</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a href="#">New Rental</a></li>
                      <li><a href="#">Return Rental</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Movies</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a href="#">Search Movies</a></li>
                      <li><a href="#">New Movie</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Customers</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a href="#">Search Customers</a></li>
                      <li><a href="#">New Customer</a></li>
                  </ul>
              </div>
          </li>
          <li>
              <a href="#">Reports</a>
              <div class="uk-navbar-dropdown">
                  <ul class="uk-nav uk-navbar-dropdown-nav">
                      <li><a href="#">Overdue Rentals</a></li>
                      <li><a href="#">Popular Movies</a></li>
                      <li><a href="#">Frequent Customers</a></li>
                  </ul>
              </div>
          </li>
        </ul>
      </div>
    </nav>
    <div id="mobilePrimary" uk-offcanvas="mode: push; overlay: true; flip: true">
      <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <ul class="uk-nav uk-nav-default">
          <li class="uk-nav-header">Rentals</li>
          <li><a href="#">New Rental</a></li>
          <li><a href="#">Return Rental</a></li>
          <li class="uk-nav-header">Movies</li>
          <li><a href="#">Search Movies</a></li>
          <li><a href="#">Add New Movie</a></li>
          <li class="uk-nav-header">Customers</li>
          <li><a href="#">Search Customers</a></li>
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
    props: ['data']
  }
</script>