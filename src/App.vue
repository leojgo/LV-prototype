<template>
  <div class="uk-offcanvas-content" id="app">
    <vHeader :data="data" />
    <main class="uk-container uk-background-default">
      <!--<router-view></router-view>-->
      <vHome :data="data" />
    </main>
    <footer class="uk-text-center uk-text-small uk-padding">
      <address>
        <strong>Lackluster Video</strong> 123 Fake Street, Springfield, IL 60666 | <a href="tel:#">(800) 588-2300</a></address>
        <p>Mon - Fri 10am - 9pm | Sat 10am - 10pm | Sun 12pm - 6pm</p>
    </footer>
  </div>
</template>

<script>
//import Accordion from './components/uikit/Accordion.vue'
//import Alert from './components/uikit/Alert.vue'
import vHeader from './components/Header.vue'
import vHome from './components/Home.vue'
export default {
  components: {
    vHeader,
    vHome
  },
  props: ['data']
}
</script>

