<template>
  <div class="uk-offcanvas-content" id="app">
    <vHeader :data="data" />
    <main class="uk-container uk-background-default" @clicked="login, loginHelp, getMovies">
      <router-view :data="data" v-if="data.isAuthenticated"></router-view>
      <!--LOGIN-->
      <form v-else class="uk-section">
        <div class="uk-margin">
          <input class="uk-input" type="text" name="user" placeholder="user id" v-on:keyup.enter="login" v-on:focus="clearLoginError">
        </div>
        <div class="uk-margin">
          <input class="uk-input" type="password" name="password" placeholder="********" v-on:keyup.enter="login" v-on:focus="clearLoginError">
        </div>
        <div v-if="data.loginError" class="uk-alert-danger uk-text-small" uk-alert>
            <!--<a class="uk-alert-close" uk-close></a>-->
            <p>User id/password combination incorrect!</p>
        </div>
        <!--change link to button or submit input on final build-->
        <a class="uk-button uk-button-default" v-on:click="login(data)">Login</a>
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
  methods: { 
    login() {
      var user = document.querySelector("input[name=user]").value;
      var pass = document.querySelector("input[name=password]").value;
      if (user.length < 1 || pass.length < 1) {
        this.$router.app.$emit('loginError'); //empty inputs
      }
      else {
        //send login request
        var xhr = new XMLHttpRequest();
        var url = "/api/login";
        var vm = this;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
          //TODO 200 used for local testing, remove for prod
          if (xhr.readyState === 4 && (xhr.status === 201 || xhr.status === 200)) {
              //send the response to Vue
              vm.$router.app.$emit('login', JSON.parse(this.responseText));
          }
          else {
            vm.$router.app.$emit('loginError'); // 404 or sever error -- TODO revise when API supports error handling with message return
          }
        };
        var jsonDdata = JSON.stringify({"username": user, "password": pass});
        xhr.send(jsonDdata);
      }
    },
    loginHelp() {
      console.log('emit login help modal');
      this.$router.app.$emit('loginHelp' );
    },
    clearLoginError() {
      this.$router.app.$emit('clearLoginError');
    }
  }
}
</script>

