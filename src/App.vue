<template>
  <div class="uk-offcanvas-content" id="app">
    <vHeader :data="data" />
    <main class="uk-container uk-background-default" @clicked="login, loginHelp, getMovies">
      <router-view :data="data" v-if="data.isAuthenticated"></router-view>
      <!--LOGIN-->
      <form v-else class="uk-section">
        <div class="uk-margin">
          <input class="uk-input" type="text" name="user" placeholder="username" v-on:keyup.enter="login" v-on:focus="clearUsernameError" v-bind:class="{ 'uk-form-danger': usernameError }">
          <span v-if="usernameError" class="uk-text-small uk-text-danger">username incorrect</span>
        </div>
        <div class="uk-margin">
          <input class="uk-input" type="password" name="password" placeholder="********" v-on:keyup.enter="login" v-on:focus="clearPasswordError" v-bind:class="{ 'uk-form-danger': passwordError }">
          <span v-if="passwordError" class="uk-text-small uk-text-danger">password incorrect</span>
        </div>
        <!--change link to button or submit input on final build-->
        <a class="uk-button uk-button-default" v-on:click="login">Login</a>
        <a class="uk-text-small uk-align-right" v-on:click="loginHelp" uk-toggle="target: #modal">I need help logging in</a>
      </form>
    </main>
    <footer class="uk-text-center uk-text-small uk-padding">
      <address>
        <strong>Lackluster Video</strong> 123 Fake Street, Springfield, IL 60666 | <a href="tel:#">(800) 588-2300</a></address>
        <p>Mon - Fri 10am - 9pm | Sat 10am - 10pm | Sun 12pm - 6pm</p>
    </footer>
    <!--modal-->
    <div id="modal" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <h2 class="uk-modal-title uk-text-large" v-if="data.modal">{{ data.modal.title }}</h2>
        <div v-html="data.modal.body" v-if="data.modal"></div>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from './components/Header.vue'
export default {
  name: 'app',
  components: {
    vHeader,
  },
  props: ['data'],
  data()  {
    return {
      usernameError : false,
      passwordError : false
    }
  },
  methods: { 
    login(user, password) {
      console.log('emit login event');
      var auth = {
        user: "Tom",
        clerkPass: "1234",
        managerPass: "4321"
      };
      var user = {
        name: null,
        role: null
      }
      user.name = document.querySelector("input[name=user]").value;
      if (user.name == auth.user) {
        if (document.querySelector("input[name=password]").value == auth.clerkPass) {
          user.role = "Clerk";
          this.$router.app.$emit('login', user );
        }
        else if (document.querySelector("input[name=password]").value == auth.managerPass) {
          user.role = "Manager";
          this.$router.app.$emit('login', user);
        }
        else {
          //give validation feedback to user
          console.log('invalid password')
          this.passwordError = true;
        }
      }
      else {
        console.log('invalid username')
        this.usernameError = true;
        this.passwordError = true;
      }
    },
    loginHelp() {
      console.log('emit login help modal');
      this.$router.app.$emit('loginHelp' );
    },
    clearUsernameError() {
      this.usernameError = false;
    },
    clearPasswordError() {
      this.passwordError = false;
    }
  }
}
</script>

