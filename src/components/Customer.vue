<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Customer Account</h1>
      <h1 v-else class="uk-text-large" style="position: relative">Customer Account 
        <ul class="uk-iconnav uk-position-top-right">
          <li v-if="data.isEdit"><a href="#" uk-icon="icon: close"></a></li>
          <li v-if="data.isEdit == false"><a href="#" uk-icon="icon: pencil"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <form v-if="data.isEdit" class="uk-form" uk-grid @submit.prevent="handleSubmit">
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" name="customerFirstName" placeholder="John" v-bind:class="{ 'uk-form-danger' : firstNameError }" v-on:focus="clearFirstError" v-model="data.selected.firstName">
        </div>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" name="customerLastName" placeholder="Smith" v-bind:class="{ 'uk-form-danger' : lastNameError }" v-on:focus="clearLastError" v-model="data.selected.lastName">
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="customerAddress" v-bind:class="{ 'uk-form-danger' : addressError }" placeholder="Address Line" v-on:focus="clearAddressError" :v-model="data.selected.address">
        </div>
        <!--City/State/ZIP: assume all local addresses-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="customerCity" placeholder="City" v-bind:class="{ 'uk-form-danger' : cityError }" v-on:focus="clearCityError" v-model="data.selected.city">
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
          <input class="uk-input" type="text" name="customerZip" placeholder="60666" v-bind:class="{ 'uk-form-danger' : zipError }" v-on:focus="clearZipError" v-model="data.selected.zip"> 
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-1">
            <!--add label-->
            <input class="uk-input" type="text" name="customerPhone" placeholder="800-588-2300" v-model="data.selected.phone" v-on:keyup="formatPhone" v-on:focus="clearPhoneError" v-bind:class="{ 'uk-form-danger' : phoneError }">
            <!--add help text-->
            <span v-if="phoneError" class="uk-text-small uk-text-danger">please enter a valid phone number</span>
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="customerEmail" placeholder="you@example.com" v-bind:class="{ 'uk-form-danger' : emailError }" v-on:focus="clearEmailError" v-model="data.selected.email">
            <span v-if="emailError" class="uk-text-small uk-text-danger">please enter a valid email address</span>
        </div>
        <div class="uk-width-1-1">
          <label><input class="uk-checkbox" type="checkbox" name="customerNewsletter" checked> Add to Mailing List</label>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <button class="uk-button uk-button-default uk-margin-left">Cancel</button>
        </div>
      </form>
      <div v-else style="position: relative">
        <!--view only-->
        <div v-for="(customer, id) in data.selected" style="position: relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ $route.params.id }}</span>
          <strong>{{ customer.firstName }} {{ customer.lastName }}</strong><br />
          <span class="uk-text-small">{{ customer.address }}, {{ customer.City }}, {{ customer.state }} {{ customer.zip }} <br />{{ customer.phone }}</span>
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
            <span class="uk-text-small">{{ customer.address }}, {{ customer.City }}, {{ customer.state }} {{ customer.zip }}<br />{{ customer.phone }}</span>
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
        firstNameError: false,
        lastNameError: false,
        addressError: false,
        cityError: false,
        zipError: false,
        phoneError: false,
        emailError: false
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
      addForm(event) {
        //load form with blank data
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
      clearFirstError() {
        //all of these clear fns should be one with param for elem
        this.firstNameError = false;
      },
      clearLastError() {
        this.lastNameError = false;
      },
      clearAddressError() {
        this.addressError = false;
      },
      clearCityError() {
        this.cityError = false;
      },
      clearZipError() {
        this.zipError = false;
      },
      clearPhoneError() {
        this.phoneError = false;
      },
      clearEmailError() {
        this.emailError = false;
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
        if (document.querySelector("input[name=customerFirstName]").value.length < 1) {
          this.firstNameError = true;
          hasError = true;
        }
        if (document.querySelector("input[name=customerLastName]").value.length < 1) {
          this.lastNameError = true;
        }
        if (document.querySelector("input[name=customerAddress]").value.length < 1) {
          this.addressError = true;
        }
        if (document.querySelector("input[name=customerCity]").value.length < 1) {
          this.cityError = true;
        }
        if (document.querySelector("input[name=customerZip]").value.length < 1) {
          this.zipError = true;
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
          this.$router.app.$emit('addCustomer', newCustomer, "123457");
        }
      }
    }
  }
</script>