<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Customer Account</h1>
      <h1 v-else class="uk-text-large  uk-text-muted uk-position-relative">Customer Account 
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><a href="#" uk-icon="close" v-on:click="cancelEdit"></a></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><a href="#" uk-icon="pencil" v-on:click="editForm($route.params.id)"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <form v-for="(customer, id) in data.selected" v-if="data.isEdit" class="uk-form" uk-grid @submit.prevent="handleSubmit">
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" name="customerFirstName" placeholder="John" v-bind:class="{ 'uk-form-danger' : errors.customerFirstName }" v-on:focus="clearError('customerFirstName')" v-model="customer.firstName">
        </div>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" name="customerLastName" placeholder="Smith" v-bind:class="{ 'uk-form-danger' : errors.customerLastName }" v-on:focus="clearError('customerLastName')" v-model="customer.lastName">
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="customerAddress" placeholder="Address Line" v-bind:class="{ 'uk-form-danger' : errors.customerAddress }" v-on:focus="clearError('customerAddress')"v-model="customer.address">
        </div>
        <!--City/State/ZIP: assume all local addresses-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="customerCity" placeholder="City" v-bind:class="{ 'uk-form-danger' : errors.customerCity }" v-on:focus="clearError('customerCity')" v-model="customer.city">
        </div>
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
          <input class="uk-input" type="text" name="customerZip" placeholder="60666" v-bind:class="{ 'uk-form-danger' : errors.customerZip }" v-on:focus="clearError('customerZip')" v-model="customer.zip"> 
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-1">
            <!--add label-->
            <input class="uk-input" type="text" name="customerPhone" placeholder="800-588-2300" v-model="customer.phone" v-on:keyup="formatPhone" v-bind:class="{ 'uk-form-danger' : errors.customerPhone }" v-on:focus="clearError('customerPhone')">
            <!--add help text-->
            <span v-if="errors.customerPhone" class="uk-text-small uk-text-danger">please enter a valid phone number</span>
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="customerEmail" placeholder="you@example.com" v-bind:class="{ 'uk-form-danger' : errors.customerEmail }" v-on:focus="clearError('customerEmail')" v-model="customer.email">
            <span v-if="errors.customerEmail" class="uk-text-small uk-text-danger">please enter a valid email address</span>
        </div>
        <div class="uk-width-1-1">
          <label><input class="uk-checkbox" type="checkbox" name="customerNewsletter" checked> Add to Mailing List</label>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit" v-if="data.isNew == false">Cancel</span>
        </div>
      </form>
      <div v-else style="position: relative">
        <!--view only-->
        <div v-for="(customer, id) in data.selected" style="position: relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ $route.params.id }}</span>
          <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
          <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }} <br />{{ customer.phone }}</span>
        </div>
        <hr />
        <button class="uk-button uk-button-default">View Rental History</button>
        <button class="uk-button uk-button-default" v-if="data.isManager">View Ledger</button>
      </div>
    </div>
    <div v-else>
      <!--customer search view-->
      <label class="uk-form-label uk-text-large uk-text-muted uk-margin uk-display-block" for="customerKeyword">Find a Customer</label>
      <div class="uk-search uk-search-default uk-width-1-1">
        <input type="search" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input" id="customerKeyword" name="customerKeyword" v-on:keyup.enter="search">  
        <button v-on:click="search" class="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon></button>
        <!--<span class="uk-button uk-button-default"  v-on:click="search">Search</span>-->
      </div>
      <div v-if="data.customers" class="uk-margin-top">
        <!--
        <h1 class="uk-text-large uk-heading-divider">Customer Search Results <strong>{{ data.query }}</strong></h1>
        -->
        <hr>
        <!--loop over results-->
        <ul class="uk-list uk-list-divider">
          <!--move style to cutom css-->
          <li v-for="(customer, id) in data.customers" style="position: relative" v-on:click="view(id)">
            <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ id }}</span>
            <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
            <span class="uk-text-small">{{ customer.address }}, {{ customer.city }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'customer',
    props: ['data'],
    data() {
      return {
        customerToEdit: null,
        errors: {
          customerFirstName: false,
          customerLastName: false,
          customerAddress: false,
          customerCity: false,
          customerZip: false,
          customerPhone: false,
          customerEmail: false
        }
      }
    },
    methods: {
      search() {
        var query = document.querySelector("input[name=customerKeyword]").value;
        this.$router.app.$emit('searchCustomer', query);
      },
      view(id) {
        this.$router.app.$emit('viewCustomer',id);
      },
      editForm(id) {
        this.cancelEdit();
        this.customerToEdit = id;
        this.$router.app.$emit('editCustomer',id);
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
          var phoneNumber = document.querySelector("input[name=customerPhone]");
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
      handleSubmit() {
        //check text inputs for content
        //check for valid phone
        var hasError = false;
        var phoneNumber = document.querySelector("input[name=customerPhone]");
        if (phoneNumber.value.length != 12) {
          this.phoneError = true;
          hasError = true;
        }
        //check for valid email
        var emailInput = document.querySelector("input[name=customerEmail]");
        var validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!validEmail.test(String(emailInput.value).toLowerCase())) {
          //add error class
          this.emailError = true;
          hasError = true;
        };
        //check for missing inputs
        for (var input in this.errors) {
          if (document.querySelector("input[name="+input+"]").value.length < 1) {
            this.errors[input] = true;
            hasError = true;
          }
        }
        if (hasError) {
          //show error messages
        }
        else {
          var newCustomer = {
            firstName: document.querySelector("input[name=customerFirstName]").value,
            lastName: document.querySelector("input[name=customerLastName]").value,
            address: document.querySelector("input[name=customerAddress]").value,
            city: document.querySelector("input[name=customerCity]").value,
            state: "IL",
            zip: document.querySelector("input[name=customerZip]").value,
            email: document.querySelector("input[name=customerEmail]").value,
            phone: document.querySelector("input[name=customerPhone]").value
          }
          if (this.$router.app.data.isNew) {
            this.$router.app.$emit('addCustomer', newCustomer);
          }
          else {
            this.$router.app.$emit('updateCustomer', this.customerToEdit);
          }
        }
      },
      cancelEdit() {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        this.$router.app.$emit('cancelEdit');
        this.$router.app.$emit('viewCustomer', this.customerToEdit);
      }
    }
  }
</script>