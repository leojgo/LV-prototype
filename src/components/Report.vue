<template>
  <div class="uk-section">
    <div class="uk-alert-danger uk-text-small" uk-alert>
      <!--<a class="uk-alert-close" uk-close></a>-->
      <p>Prototyope for placement only -- not for functional review!</p>
    </div>
    <div v-if="$route.params.type == 'overdue'">
    <h1 class="uk-text-muted uk-text-large">Overdue Rentals Report</h1>
    <table class="uk-table uk-table-divider">
      <caption></caption>
      <thead>
        <tr>
          <th>Due Date<!--<span uk-icon="icon: triangle-down"></span>--></th>
          <th>Customer</th>
          <th>Phone</th>
          <th>Movie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in data.reports">
          <td>{{ report.returnDate }}</td>
          <td><a href="#">{{ report.custFirstName }} {{ report.custLastName }}</a></td>
          <td><a href="#">{{ report.custPhoneNumber }}</a></td>
          <td><a href="#">{{ report.Title }}</a></td>
        </tr>
      </tbody>
    </table>
    </div>
    <div v-if="$route.params.type == 'popular'">
    <div uk-grid>
      <h1 class="uk-text-muted uk-text-large uk-width-3-4@s">Popular Movies Report</h1>
      <!--TODO
      <div class="uk-width-1-4@s">
          <select class="uk-select">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>All Time</option>
          </select>
      </div>
      -->
    </div>
    <table class="uk-table uk-table-divider">
      <caption></caption>
      <thead>
        <tr>
          <th>Rentals</th>
          <th>Movie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in data.reports">
          <td>{{ report.count }}</td>
          <td><a href="#">{{ report.title }}</a></td>
        </tr>

      </tbody>
    </table>
    </div>
    <div v-if="$route.params.type == 'customers'">
    <div uk-grid>
      <h1 class="uk-text-muted uk-text-large uk-width-3-4@s">Best Customers Report</h1>
      <!-- TODO
      <div class="uk-width-1-4@s">
          <select class="uk-select">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>All Time</option>
          </select>
      </div>
    -->
    </div>
    <table class="uk-table uk-table-divider">
      <caption></caption>
      <thead>
        <tr>
          <th>Rentals</th>
          <th>Customer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>10</td>
          <td><a href="#">Cindy Johnson</a></td>
        </tr>
        <tr>
          <td>8</td>
          <td><a href="#">Ellen Johnson</a></td>
        </tr>
        <tr>
          <td>4</td>
          <td><a href="#">Mark Thompson</a></td>
        </tr>
        <tr>
          <td>2</td>
          <td><a href="#">Harvey Dent</a></td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'report',
    props: ['data']
  }
</script>