<template>
  <div class="uk-section" v-if="data.isManager">
    <div v-if="data.isSingle">
      <h1 class="uk-text-muted uk-text-large" v-if="data.isNew">Create User Account</h1>
      <h1 class="uk-text-muted uk-text-large uk-position-relative" v-else>User Account
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><a href="#" uk-icon="close" v-on:click="cancelEdit"></a></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><a uk-icon="pencil" v-on:click="editForm($route.params.id)"></a></li>
          <li><a href="#" uk-icon="icon: trash" v-on:click="deleteEmployee(data.employee)"></a></li>
        </ul>
      </h1>
      <div class="uk-alert uk-alert-success" v-if="data.successMessage">{{ data.successMessage }}</div>
      <div class="uk-alert uk-alert-danger" v-if="data.erorMessage">{{ data.errorMessage }}</div>
      <div v-if="!data.isEdit" class="uk-position-relative">
        <span class="uk-label uk-label uk-text-small uk-position-top-right uk-margin-small-top">{{ data.employee.employeeTitle }}</span>
        <strong>{{ data.employee.firstName }} {{ data.employee.lastName }}</strong><br />
        Employee ID: {{ data.employee.employeeId }}<br />
        <span class="uk-text-small">Phone Number: {{ data.employee.phoneNumber }}</span>
        <hr />
        <div v-if="!editPassword">
          <div class="uk-alert uk-alert-success" v-if="data.resetSuccess">
            <p><strong>Success!</strong> Password reset confirmed.</p>
          </div>
          <button class="uk-button uk-button-default" v-on:click="resetLogin">Reset Login</button>
        </div>
        <div v-else uk-grid>
          <div class="uk-width-1-2@s">
            <input type="password" name="passwordReset" class="uk-input" v-bind:class="{ 'uk-form-danger' : resetErrors.userPass }" v-on:focus="clearResetError('userPass')">
            <span class="uk-text-small" >please enter new password</span>
          </div>
          <div class="uk-width-1-2@s">
            <input type="password" name="passwordResetConfirm" class="uk-input" v-bind:class="{ 'uk-form-danger' : resetErrors.userPass }" v-on:focus="clearResetError('userPass')">
            <span class="uk-text-small">please confirm new password</span>
          </div>
          <div class="uk-width-1-2@s">
            <input type="password" name="managerPassword" class="uk-input" v-bind:class="{ 'uk-form-danger' : resetErrors.managerPass }" v-on:focus="clearResetError('managerPass')">
            <span class="uk-text-small">please enter your manager account password</span>
          </div>
          <div v-if="hasErrors" class="uk-width-1-1">
            <div class="uk-alert-danger" uk-alert>
              {{ errorMessage }}
            </div>
          </div>
          <div class="uk-width-1-1">
            <hr />
            <button class="uk-button uk-button-primary" v-on:click="submitReset">Submit</button>
            <button class="uk-button uk-button-default" v-on:click="cancelReset">Cancel</button>
          </div>
        </div>
      </div>
      <div v-else uk-grid>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="userFirstName" placeholder="John" v-bind:class="{ 'uk-form-danger' : errors.userFirstName }" v-on:focus="clearError('userFirstName')" v-model="data.employee.firstName">
          <span class="uk-text-small uk-text-danger" v-if="errors.userFirstName">First name isn't long enough!</span>
        </div>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="userLastName" placeholder="Smith" v-bind:class="{ 'uk-form-danger' : errors.userLastName }" v-on:focus="clearError('userLastName')" v-model="data.employee.lastName">
          <span class="uk-text-small uk-text-danger" v-if="errors.userLastName">Last name isn't long enough!</span>
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" name="userPhone" placeholder="800-588-2300" v-model="data.employee.phoneNumber" v-bind:class="{ 'uk-form-danger' : errors.userPhone }" v-on:focus="clearError('userPhone')">
            <span v-if="errors.userPhone" class="uk-text-small uk-text-danger">please enter a valid phone number</span>
        </div>
        <div class="uk-width-1-2@s" v-if="data.isNew">
          <input class="uk-input" type="password" name="userPass" placeholder="*****" v-bind:class="{ 'uk-form-danger' : errors.userPass }" v-on:focus="clearError('userPass')">
          <span class="uk-text-small">please enter a password</span>
        </div>
        <div class="uk-width-1-2@s" v-if="data.isNew">
            <input class="uk-input" type="password" name="userPassConfirm" placeholder="*****" v-bind:class="{ 'uk-form-danger' : errors.userPass }" v-on:focus="clearError('userPass')">
            <span class="uk-text-small">please confirm password</span>
        </div>
        <div class="uk-width-1-1" v-model="data.employee.isManager">
          <label class="uk-margin-right"><input class="uk-radio" type="radio" name="isManager" value="2" :checked="!data.employee.isManager"> Clerk</label>
          <label><input class="uk-radio" type="radio" name="isManager" value="1" :checked="data.employee.isManager"> Manager</label>
        </div>
        <div v-if="hasErrors" class="uk-width-1-1">
          <div class="uk-alert-danger" uk-alert>
          {{ errorMessage }}
          </div>
        </div>
        <div class="uk-width-1-1">
          <hr />
          <button class="uk-button uk-button-primary" v-on:click="handleSubmit(data)">Save</button> <!--TODO replace with form handler-->
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
        <tr v-for="employee in data.employees" v-if="employee.active">
          <!--TODO make date reactive-->
          <td>2/23/18</td>
          <td><span class="uk-text-primary" v-on:click="viewEmployee(employee.employeeId)">{{ employee.firstName }} {{ employee.lastName }}</span></td>
          <td>{{ employee.employeeTitle }}</td>
          <td>{{ employee.employeeId }}</td>
        </tr>
        <!--
        <tr>
          <td>2/23/18</td>
          <td><a is="router-link" to="/users/443">Cindy Johnson</a></td>
          <td>Clerk</td>
          <td>443</td>
        </tr>-->
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
        //TODO Revise form fields
        userToEdit: null,
        editPassword: false,
        hasErrors: false,
        errorMessage: "An error has occurred!",
        errors: {
          userFirstName: false,
          userLastName: false,
          userPhone: false,
          userPass: false
        },
        resetErrors: {
          userPass: false,
          managerPass: false
        }
      }
    },
    methods: {
      viewEmployee(employee) {
        console.log('emit viewEmployee '+employee);
        this.$router.app.$emit('viewEmployee',employee);
      },
      editForm(id) {
        //TODO should be done with routes instead ??
        //this.cancelEdit();
        this.userToEdit = id;
        this.$router.app.$emit('editEmployee',id);
      },
      clearError(input) {
        this.errors[input] = false;
      },
      clearResetError(input) {
        this.resetErrors[input] = false;
      },
      cancelEdit() {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        this.$router.app.$emit('viewEmployee', this.userToEdit);
      },
      deleteEmployee(employee) {
        employee.active = false;
        this.$router.app.$emit('deleteEmployee', employee);
      },
      handleSubmit(data) {
        console.log('handle submit')
        var employee = data.employee;
        this.hasErrors = false;
        this.errorMessage = "";
        if (data.isNew) {
          employee.firstName = document.getElementsByName("userFirstName")[0].value;
          employee.lastName = document.getElementsByName("userLastName")[0].value;
          employee.phoneNumber = document.getElementsByName("userPhone")[0].value;
        }
        //check for first name and last name input
        if (employee.firstName.length < 2) {
          this.errors.userFirstName = true;
          this.hasErrors = true;
          this.errorMessage = "Please make sure your to include your full name! ";
        }
        if (employee.lastName.length < 2) {
          this.errors.userLastName = true;
          this.hasErrors = true;
          this.errorMessage = "Please make sure your to include your full name! ";
        }
        //TODO better handling for phone numbers
        employee.phoneNumber = document.getElementsByName("userPhone")[0].value.replace(/\D/g,'');
        if (employee.phoneNumber.length != 10) {
          this.errors.userPhone = true;
          if (!this.hasErrors) {
            this.errorMessage = "";
            this.hasErrors = true;
          }
          this.errorMessage = this.errorMessage + "Please enter a valid 10 digit phone number! ";
        }
        //assign role -- TODO refactor based on API vals
        var radios = document.getElementsByName("isManager");
        employee.employeeType = radios.value;
        for (var i = 0; i < radios.length; i++) {
          if (radios[i].checked) {
            employee.employeeType = radios[i].value;
            break;
          }
        }
        //new checks
        if (data.isNew) {
          employee.RawPw = document.querySelector("input[name=userPass]").value;
          //some validation
          if (employee.RawPw != document.querySelector("input[name=userPassConfirm]").value) {
            if (!this.hasErrors) {
              this.errorMessage = "";
              this.hasErrors = true;
            }
            this.errorMessage = this.errorMessage + "Your password and confirmation don't match! ";
            this.errors.userPass = true;
          }
          else {
            //valide password
            /*
            * Requirements for Passwords:
            * At Least 1 Digit
            * At Least 1 Uppercase Letter
            * At Least 1 Lowercase Letter
            * Length is Greater than MinPwLength (6)
            * Length is Less than MaxPwLength (25)
            //^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])$
            */
            //no password
            if (employee.RawPw.length < 6 || employee.RawPw.length > 20) {
              //password too long!
              if (!this.hasErrors) {
                this.errorMessage = "";
                this.hasErrors = true;
              }
              this.errorMessage = this.errorMessage + "Your password needs to be between 6 and 20 characters long! ";
              this.errors.userPass = true;
            }
            else {
              var validPW = employee.RawPw.match(/[^a-z0-9]/);
              if (validPW != null) {
                console.log(employee);
                this.hasErrors = false;
                this.$router.app.$emit('createEmployee', employee);
              }
              else {
                if (!this.hasErrors) {
                  this.errorMessage = "";
                  this.hasErrors = true;
                }
                this.errorMessage = this.errorMessage + "Your password needs to have a number, an uppercase letter, and a lowercase letter! ";
                this.errors.userPass = true;
              }
            }
          }
        }
        else {
          if (!this.hasErrors) {
            console.log(employee);
            this.$router.app.$emit('updateEmployee', employee);
          }
        }
      },
      resetLogin() {
        this.editPassword = true;
        this.$router.app.data.resetSuccess = false;
      },
      cancelReset() {
        this.editPassword = false;
      },
      submitReset() {
        this.errorMessage = "";
        this.hasErrors = false;
        //validation
        var userPass = document.querySelector("input[name=passwordReset]").value;
        var userPassConfirm = document.querySelector("input[name=passwordResetConfirm]").value
        var managerPass = document.querySelector("input[name=managerPassword]").value
        if (userPass.length < 6 || userPass.length > 20) {
          //password too short or too long!
          if (!this.hasErrors) {
            this.errorMessage = "";
            this.hasErrors = true;
          }
          this.errorMessage = this.errorMessage + "New password needs to be between 6 and 20 characters long! ";
          this.resetErrors.userPass = true;
        }
        else {
          var validPW = userPass.match(/[^a-z0-9]/);
          this.errorMessage = "";
          //matches char req'ts
          if (validPW != null) {
            //doesn't match confirmation
            if (userPass != userPassConfirm) {
              this.hasErrors = true;
              this.errorMessage = this.errorMessage + "New password and confirmation don't match! ";
              this.resetErrors.userPass = true;
            }
            //manager password too short or too long
            if (managerPass.length < 6 || managerPass.length > 20) {
              this.hasErrors = true;
              this.errorMessage = this.errorMessage + "Manager password needs to be between 6 and 20 characters long! ";
              this.resetErrors.managerPass = true;
            }
            else {
              //manager password doesn't mach char req'ts
              var validManagerPW = managerPass.match(/[^a-z0-9]/);
              if (validManagerPW == null) {
                this.hasErrors = true;
                this.errorMessage = this.errorMessage + "Manager password needs to have a number, an uppercase letter, and a lowercase letter! ";
                this.resetErrors.managerPass = true;
              }
            }
            if (!this.hasErrors) {
              var params = {
                userPass: document.querySelector("input[name=passwordReset]").value,
                managerPass: document.querySelector("input[name=managerPassword]").value
              }
              this.editPassword = false; //TODO refactor this for better error handling
              this.$router.app.$emit('resetLogin', params);
            }
          }
          else {
            this.hasErrors = true;
            this.errorMessage = this.errorMessage + "New password needs to have a number, an uppercase letter, and a lowercase letter! ";
            this.resetErrors.userPass = true;
          }
        }
      }
    }
  }
</script>