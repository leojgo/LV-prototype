import Vue from 'vue'
import App from './App.vue'
import router from './routes.js'


//import UIkit from './js/uikit'; 
//import Icons from './dist/js/uikit-icons';

// loads the Icon plugin
//UIkit.use(Icons);

// components can be called from the imported UIkit reference
// UIkit.notification('Hello world.');

var app = new Vue({
  el: '#app',
  router,
  template: '<App :data="data"/>',
  components: { App },
  data() {
    return { 
      data: {
        company: 'Lackluster Video',
        isAuthenticated: true,
        isManager: false,
        user: "Tom",
        role: "Cashier"
      }
    }
  },
  mounted() {
    var vm = this;
    console.log(vm);    
  },
})

//nav guards
router.beforeEach((to, from, next) => {
  console.log('to '+to.fullPath);
  next();
})