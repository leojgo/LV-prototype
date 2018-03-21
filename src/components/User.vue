<template>
  <div class="uk-section" v-if="data.isManager">
    <div v-if="data.isSingle">
      <h1 class="uk-text-muted uk-text-large" v-if="data.isNew">Create User Account</h1>
      <h1 class="uk-text-muted uk-text-large uk-position-relative" v-else>User Account
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><a href="#" uk-icon="close" v-on:click="cancelEdit"></a></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><a uk-icon="pencil" v-on:click="editForm($route.params.id)"></a></li>
          <li><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1>
      <div v-if="!data.isEdit" class="uk-position-relative">
        <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">Clerk</span>
        Employee ID: {{ data.user.employeeId }}<br />
        <strong>{{ data.user.firstName }} {{ data.user.lastName }}</strong><br />
        <!--TODO make address reactive-->
        <span class="uk-text-small">239 Elm St, Springfield, IL 60666 <br>773-998-2664</span>
        <hr />
        <button class="uk-button uk-button-default" v-on:click="resetLogin" uk-toggle="target: #modal">Reset Login</button>
      </div>
      <div v-else uk-grid>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="userFirstName" placeholder="John" v-bind:class="{ 'uk-form-danger' : errors.userFirstName }" v-on:focus="clearError('userFirstName')" v-model="data.user.firstName">
        </div>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="userLastName" placeholder="Smith" v-bind:class="{ 'uk-form-danger' : errors.userLastName }" v-on:focus="clearError('userLastName')" v-model="data.user.lastName">
        </div>
        <!--TODO make address reactive-->
        <div class="uk-width-1-1">
          <input class="uk-input" type="text" name="userAddress" placeholder="Address Line" v-bind:class="{ 'uk-form-danger' : errors.userAddress }" v-on:focus="clearError('userAddress')"v-model="data.user.address">
        </div>
        <!--City/State/ZIP: assume all local addresses-->
        <!--TODO make address reactive-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="userCity" placeholder="City" v-bind:class="{ 'uk-form-danger' : errors.userCity }" v-on:focus="clearError('userCity')" v-model="data.user.city">
        </div>
        <!--TODO make address reactive-->
        <div class="uk-width-1-2 uk-width-1-4@s uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
              <option value="AL">AL</option>
              <option value="AK">AK</option>
              <option value="AR">AR</option>  
              <option value="AZ">AZ</option>
              <option value="CA">CA</option>
              <option value="CO">CO</option>
              <option value="CT">CT</option>
              <option value="DC">DC</option>
              <option value="DE">DE</option>
              <option value="FL">FL</option>
              <option value="GA">GA</option>
              <option value="HI">HI</option>
              <option value="IA">IA</option>  
              <option value="ID">ID</option>
              <option value="IL" selected>IL</option>
              <option value="IN">IN</option>
              <option value="KS">KS</option>
              <option value="KY">KY</option>
              <option value="LA">LA</option>
              <option value="MA">MA</option>
              <option value="MD">MD</option>
              <option value="ME">ME</option>
              <option value="MI">MI</option>
              <option value="MN">MN</option>
              <option value="MO">MO</option>  
              <option value="MS">MS</option>
              <option value="MT">MT</option>
              <option value="NC">NC</option>  
              <option value="NE">NE</option>
              <option value="NH">NH</option>
              <option value="NJ">NJ</option>
              <option value="NM">NM</option>      
              <option value="NV">NV</option>
              <option value="NY">NY</option>
              <option value="ND">ND</option>
              <option value="OH">OH</option>
              <option value="OK">OK</option>
              <option value="OR">OR</option>
              <option value="PA">PA</option>
              <option value="RI">RI</option>
              <option value="SC">SC</option>
              <option value="SD">SD</option>
              <option value="TN">TN</option>
              <option value="TX">TX</option>
              <option value="UT">UT</option>
              <option value="VT">VT</option>
              <option value="VA">VA</option>
              <option value="WA">WA</option>
              <option value="WI">WI</option>  
              <option value="WV">WV</option>
              <option value="WY">WY</option>
          </select>
        </div>
        <div class="uk-width-1-2 uk-width-1-4@s">
          <input class="uk-input" type="text" name="userZip" placeholder="60666" v-bind:class="{ 'uk-form-danger' : errors.userZip }" v-on:focus="clearError('userZip')" v-model="data.user.zip"> 
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-2@s">
            <!--add label-->
            <input class="uk-input" type="text" name="userPhone" placeholder="800-588-2300" v-model="data.user.phone" v-on:keyup="formatPhone" v-bind:class="{ 'uk-form-danger' : errors.userPhone }" v-on:focus="clearError('userPhone')">
            <!--add help text-->
            <span v-if="errors.userPhone" class="uk-text-small uk-text-danger">please enter a valid phone number</span>
        </div>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" name="userEmail" placeholder="you@example.com" v-bind:class="{ 'uk-form-danger' : errors.userEmail }" v-on:focus="clearError('userEmail')" v-model="data.user.email">
            <span v-if="errors.userEmail" class="uk-text-small uk-text-danger">please enter a valid email address</span>
        </div>
        <div class="uk-width-1-2@s" v-if="data.isNew">
            <input class="uk-input" type="password" name="userPass" placeholder="*****" >
            <span class="uk-text-small">please enter a password</span>
        </div>
        <div class="uk-width-1-2@s" v-if="data.isNew">
            <input class="uk-input" type="password" name="userPass" placeholder="*****" >
            <span class="uk-text-small">please confirm password</span>
        </div>
        <div class="uk-width-1-1">
          <label><input class="uk-radio" type="radio" name="radio2" checked> Clerk</label>
            <label><input class="uk-radio" type="radio" name="radio2"> Manager</label>
        </div>
        <div class="uk-width-1-1">
          <hr />
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit" v-if="data.isNew == false">Cancel</span>
        </div>
      </div>
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
        <tr v-for="user in data.employees">
          <!--TODO make date reactive-->
          <td>2/23/18</td>
          <td><span class="uk-text-primary" v-on:click="viewEmployee(user.employeeId)">{{ user.firstName }} {{ user.lastName }}</span></td>
          <td>{{ user.employeeTitle }}</td>
          <td>{{ user.employeeId }}</td>
        </tr>
        <tr>
          <!--TODO make reactive -->
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
    data() {
      return {
        userToEdit: null,
        errors: {
          userFirstName: false,
          userLastName: false,
          userAddress: false,
          userCity: false,
          userZip: false,
          userPhone: false,
          userEmail: false
        }
      }
    },
    methods: {
      editForm(id) {
        //TODO should be done with routes instead
        this.cancelEdit();
        this.userToEdit = id;
        this.$router.app.$emit('editUser',id);
      },
      formatPhone(event) {
        //ideally we'd move this to a library function and load library in all components
        //console.log('call validate phone');
        var key = event.keyCode || event.charCode;
        //don't do anything on delete
        if( key == 8 || key == 46 ) {
          return false;
        }
        else {
          var phoneNumber = document.querySelector("input[name=userPhone]");
          var str = phoneNumber.value;
          var sep = "-";
          var position;
          var last = phoneNumber.value.slice(-1);
          var safeLast = last.replace(/\D/g,'');
          if (last != safeLast || phoneNumber.value.length > 12) {
             //remove non-numeric or extra chars
            phoneNumber.value = phoneNumber.value.substr(0, phoneNumber.value.length-1);
          }
          else if (phoneNumber.value.length == 4 && phoneNumber.value.slice(-1) != sep) {
            //add separator for readability
            position = 3;
            phoneNumber.value = [str.slice(0, position), sep, str.slice(position)].join('');
          }
          else if (phoneNumber.value.length == 8 && phoneNumber.value.slice(-1) != sep) {
            //add separator for readability
            position = 7;
            phoneNumber.value = [str.slice(0, position), sep, str.slice(position)].join('');
          } 
        }
      },
      clearError(input) {
        this.errors[input] = false;
      },
      cancelEdit() {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        //TODO reset to inital values
        this.$router.app.$emit('cancelEdit');
        //this.$router.app.$emit('viewCustomer', this.customerToEdit);
      },
      resetLogin() {
        this.$router.app.$emit('resetLogin');
      },
      viewEmployee(employee) {
        this.$router.app.$emit('viewUser',employee);
      }
    }
  }
</script>