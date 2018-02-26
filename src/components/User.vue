<template>
  <div class="uk-section">
    <div v-if="$route.params.id">
      <h1 class="uk-text-muted uk-text-large" v-if="data.isEdit">Edit User</h1>
      <h1 class="uk-text-muted uk-text-large" v-else>View User</h1>
      <div>
        
      </div>
    </div>
    <div v-else>
      <h1 class="uk-text-muted uk-text-large">View All Users <button class="uk-button uk-button-default uk-align-right">Add New User <span uk-icon="plus-circle"></span></button></h1>
      <table class="uk-table uk-table-divider">
      <caption></caption>
      <thead>
        <tr>
          <th>Registration Date<!--<span uk-icon="icon: triangle-down"></span>--></th>
          <th>Employee</th>
          <th>Role</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/user/443">Cindy Johnson</a></td>
          <td>Clerk</td>
          <td>443</td>
        </tr>
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/user/443">Ellen Johnson</a></td>
          <td>Clerk</td>
          <td>442</td>
        </tr>
        <tr>
          <td>2/21/18</td>
          <td><a is="router-link" to="/user/443">Mark Thompson</a></td>
          <td>Clerk</td>
          <td>441</td>
        </tr>
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/user/443">Harvey Dent</a></td>
          <td>Manager</td>
          <td>440</td>
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