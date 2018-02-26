<template>
  <div class="uk-section" v-if="data.isManager">
    <div v-if="data.isSingle">
      <h1 class="uk-text-muted uk-text-large" v-if="data.isNew">Create User Account</h1>
      <h1 class="uk-text-muted uk-text-large uk-position-relative" v-else>User Account
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><a href="#" uk-icon="close" v-on:click="cancelEdit"></a></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><a href="#" uk-icon="pencil" v-on:click="editForm($route.params.id)"></a></li>
          <li><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1>
      <div v-if="data.isEdit">
        
      </div>
      <div v-else style="position: relative">
        <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">Clerk</span>
        Employee ID: 443<br />
        <strong>Cindy Johnson</strong><br />
        <span class="uk-text-small">239 Elm St, Springfield, IL 60666 <br>773-998-2664</span>
      </div>
      <hr />
      <button class="uk-button uk-button-default">Reset Password</button>
    </div>
    <div v-else>
      <h1 class="uk-text-muted uk-text-large">View All Users <button class="uk-button uk-button-default uk-align-right" is="router-link" to="/users/new">Add New User <span uk-icon="plus-circle"></span></button></h1>
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
          <td><a is="router-link" to="/users/443">Cindy Johnson</a></td>
          <td>Clerk</td>
          <td>443</td>
        </tr>
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/users/443">Ellen Johnson</a></td>
          <td>Clerk</td>
          <td>442</td>
        </tr>
        <tr>
          <td>2/21/18</td>
          <td><a is="router-link" to="/users/443">Mark Thompson</a></td>
          <td>Clerk</td>
          <td>441</td>
        </tr>
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/users/443">Harvey Dent</a></td>
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
    props: ['data'],
    methods: {
      cancelEdit() {
        
      }
    }
  }
</script>