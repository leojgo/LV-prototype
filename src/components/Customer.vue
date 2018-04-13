<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Customer Account</h1>
      <h1 v-else class="uk-text-large  uk-text-muted uk-position-relative">Customer Account
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><span uk-icon="close" v-on:click="cancelEdit"></span></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><span uk-icon="pencil" v-on:click="editForm(data.customer.customerId)"></span></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"  v-on:click="deleteCustomer(data.customer)"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <form v-if="data.isEdit" class="uk-form" uk-grid @submit.prevent="handleSubmit(data)">
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="customerFirstName" placeholder="John" v-bind:class="{ 'uk-form-danger' : errors.customerFirstName }" v-on:focus="clearError('customerFirstName')" v-model="data.customer.nameFirst">
          <span class="uk-text-small uk-text-danger" v-if="errors.customerFirstName">First name isn't long enough!</span>
        </div>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="customerLastName" placeholder="Smith" v-bind:class="{ 'uk-form-danger' : errors.customerLastName }" v-on:focus="clearError('customerLastName')" v-model="data.customer.nameLast">
          <span class="uk-text-small uk-text-danger" v-if="errors.customerLastName">Last name isn't long enough!</span>
        </div>
        <div class="uk-width-1-1">
          <input class="uk-input" type="text" name="customerAddress" placeholder="Address Line" v-bind:class="{ 'uk-form-danger' : errors.customerAddress }" v-on:focus="clearError('customerAddress')"v-model="data.customer.addLine1">
          <span class="uk-text-small uk-text-danger" v-if="errors.customerAddress">Address isn't long enough!</span>
        </div>
        <!--City/State/ZIP: assume all local addresses-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="customerCity" placeholder="City" v-bind:class="{ 'uk-form-danger' : errors.customerCity }" v-on:focus="clearError('customerCity')" v-model="data.customer.addCity">
          <span class="uk-text-small uk-text-danger" v-if="errors.customerCity">City isn't long enough!</span>
        </div>
        <!--TODO add binding-->
        <div class="uk-width-1-2 uk-width-1-4@s uk-form-controls">
          <select class="uk-select" id="form-stacked-select" v-model="data.customer.addState">
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
              <option value="IL">IL</option>
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
          <input class="uk-input" type="text" name="customerZip" placeholder="60666" v-bind:class="{ 'uk-form-danger' : errors.customerZip }" v-on:focus="clearError('customerZip')" v-model="data.customer.addZip"> 
          <span class="uk-text-small uk-text-danger" v-if="errors.customerZip">Please enter a valid zip code</span>
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-1">
            <!--add label-->
            <input class="uk-input" type="text" name="customerPhone" placeholder="800-588-2300" v-model="data.customer.phoneNumber" v-on:keyup="formatPhone" v-bind:class="{ 'uk-form-danger' : errors.customerPhone }" v-on:focus="clearError('customerPhone')">
            <!--add help text-->
            <span v-if="errors.customerPhone" class="uk-text-small uk-text-danger">please enter a valid phone number</span>
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="customerEmail" placeholder="you@example.com" v-bind:class="{ 'uk-form-danger' : errors.customerEmail }" v-on:focus="clearError('customerEmail')" v-model="data.customer.email">
            <span v-if="errors.customerEmail" class="uk-text-small uk-text-danger">please enter a valid email address</span>
        </div>
        <div class="uk-width-1-1">
          <!--TODO add binding-->
          <label><input class="uk-checkbox" type="checkbox" name="customerNewsletter" value="false" v-model="data.customer.newsletter"> Subscribe to Mailing List</label>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit" v-if="data.isNew == false">Cancel</span>
        </div>
      </form>
      <div v-else style="position: relative">
        <!--view only-->
        <div style="position: relative">
          <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ $route.params.id }}</span>
          <strong>{{ data.customer.nameFirst }} {{ data.customer.nameLast }}</strong><br />
          <span class="uk-text-small">{{ data.customer.addLine1 }}, {{ data.customer.addCity }}, {{ data.customer.addState }} {{ data.customer.addZip }} <br />{{ data.customer.phoneNumber }}</span>
        </div>
        <!-- feature tabled
        <hr />
        <button class="uk-button uk-button-default">View Rental History</button>
        <button class="uk-button uk-button-default" v-if="data.isManager">View Ledger</button>
        -->
      </div>
    </div>
    <div v-else>
      <!--customer search view-->
      <label class="uk-form-label uk-text-large uk-text-muted uk-margin uk-display-block" for="customerKeyword">Find a Customer</label>
      <div class="uk-search uk-search-default uk-width-1-1">
        <input type="search" placeholder="Enter Customer ID, Name or Phone Number" class="uk-input" id="customerKeyword" name="customerKeyword" v-on:keyup.enter="search" v-on:focus="clearSearchError"> 
        <span class="uk-text-small uk-text-danger" v-if="nullQuery">You forgot to enter your search query!</span>
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
          <li v-for="customer in data.customers" style="position: relative" v-on:click="view(customer.customerId)">
            <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ customer.customerId }}</span>
            <strong>{{ customer.nameFirst }} {{ customer.nameLast }}</strong><br />
            <span class="uk-text-small">{{ customer.addLine1 }}, {{ customer.addCity }}, {{ customer.addState }} {{ customer.addZip }}<br />{{ customer.phoneNumber }}</span>
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
        hasErrors: false,
        nullQuery: false,
        errorMessage: null,
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
        if (query.length < 1) {
          this.nullQuery = true;
        }
        else {
          this.nullQuery = false;
          this.$router.app.$emit('searchCustomer', query);
        }
      },
      clearSearchError() {
        this.nullQuery = false;
      },
      view(id) {
        //console.log('emit viewCustomer');
        this.$router.app.$emit('viewCustomer',id);
        //this.$router.push({ name: 'customerView', params: { id: id }});
      },
      editForm(id) {
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        this.customerToEdit = id; //TODO remove?
        console.log('call editForm with param '+id);
        this.$router.app.$emit('editCustomer', id);
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
      handleSubmit(data) {
        console.log('handle submit')
        var customer = {
          firstName: document.querySelector("input[name=customerFirstName]").value,
          lastName: document.querySelector("input[name=customerLastName]").value,
          addLine1: document.querySelector("input[name=customerAddress]").value,
          addCity: document.querySelector("input[name=customerCity]").value,
          addState: "IL",
          addZip: document.querySelector("input[name=customerZip]").value,
          email: document.querySelector("input[name=customerEmail]").value,
          phoneNumber: document.querySelector("input[name=customerPhone]").value.replace("-",""),
          //TODO handling for newsletter
          newsletter: document.querySelector("input[name=customerNewsletter]").value
        }
        //check text inputs for content
        //check for valid phone
        this.hasErrors = false;
        //validate phoneNumber 
        //TODO better handling for phone numbers
        customer.phoneNumber = customer.phoneNumber.replace(/\D/g,'');
        if (customer.phoneNumber.length != 10) {
          this.errors.customerPhone = true;
          if (!this.hasErrors) {
            this.errorMessage = "";
            this.hasErrors = true;
          }
          this.errorMessage = this.errorMessage + "Please enter a valid 10 digit phone number! ";
        }
        //check for valid email
        var validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!validEmail.test(String(customer.email).toLowerCase())) {
          //add error class
          this.errors.customerEmail = true;
          this.hasErrors = true;
        };
        //validate zip
        if (customer.addZip != customer.addZip.replace(/\D/g,'') || customer.addZip.length != 5) {
          this.errors.customerZip = true;
        }
        //check for missing inputs
        for (var input in this.errors) {
          if (document.querySelector("input[name="+input+"]").value.length < 1) {
            this.errors[input] = true;
            this.hasErrors = true;
          }
        }
        if (!this.hasErrors) {
          if (data.isNew) {
            //create customer
            console.log('emit createCustomer');
            this.$router.app.$emit('createCustomer', customer);
          }
          else {
            customer.active = true;
            customer["customerId"] = this.customerToEdit;
            console.log('emit updateCustomer');
            console.log(customer);
            this.$router.app.$emit('updateCustomer', customer);
          }
        }
      },
      cancelEdit() {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        this.hasErrors = false;
        this.$router.app.$emit('viewCustomer', this.customerToEdit); //get the data again in case fields
      },
      deleteCustomer(customer) {
        customer.active = false;
        this.$router.app.$emit('deleteCustomer', customer);
      }
    }
  }
</script>