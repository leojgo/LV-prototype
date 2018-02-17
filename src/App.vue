<template>
  <div class="uk-offcanvas-content" id="app">
    <vHeader :data="data" />
    <main class="uk-container uk-background-default" @clicked="login, getMovies">
      <router-view :data="data" v-if="data.isAuthenticated"></router-view>
      <!--LOGIN-->
      <form v-else class="uk-section">
        <div class="uk-margin">
          <input class="uk-input" type="text" name="user" placeholder="username">
        </div>
        <div class="uk-margin">
          <input class="uk-input" type="text" name="password" placeholder="********">
        </div>
        <!--
        <button type="submit" class="uk-button uk-button-default" v-on:click="login">Login</button>
        -->
        <span class="uk-button uk-button-default" v-on:click="login">Login</span>
      </form>
    </main>
    <footer class="uk-text-center uk-text-small uk-padding">
      <address>
        <strong>Lackluster Video</strong> 123 Fake Street, Springfield, IL 60666 | <a href="tel:#">(800) 588-2300</a></address>
        <p>Mon - Fri 10am - 9pm | Sat 10am - 10pm | Sun 12pm - 6pm</p>
    </footer>
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
        }
      }
    }
  }
}
</script>

