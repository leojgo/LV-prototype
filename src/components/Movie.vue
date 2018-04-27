<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single movie view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Movie Title</h1>
      <h1 v-else class="uk-text-large uk-position-relative">Movie Title
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><span uk-icon="close" v-on:click="cancelEdit(data.movie)"></span></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><span  uk-icon="pencil" v-on:click="editForm(data.movie.upc)"></span></li>
          <li v-if="data.isManager"><span uk-icon="icon: trash" v-on:click="deleteAll(data.movie)"></span></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <form v-if="data.isEdit" class="uk-form" uk-grid @submit.prevent="handleSubmit(data)">
        <div class="uk-width-1-1">
          <span class="uk-text-small">UPC Number</span>
          <input class="uk-input" type="text" name="movieUpc" placeholder="" v-bind:class="{ 'uk-form-danger' : errors.movieUpc }" v-on:focus="clearError('movieUpc')" v-model="data.movie.upc">
          <span class="uk-text-small uk-text-danger" v-if="errors.movieUpc">Please enter a valid UPC number</span>
        </div>
        <div class="uk-width-1-1">
          <span class="uk-text-small">Movie Title</span>
          <input class="uk-input" type="text" name="movieTitle" placeholder="" v-bind:class="{ 'uk-form-danger' : errors.movieTitle }" v-on:focus="clearError('movieTitle')" v-model="data.movie.title">
          <span class="uk-text-small uk-text-danger" v-if="errors.movieTitle">Please enter a movie title</span>
        </div>
        <div class="uk-width-1-2@s">
          <span class="uk-text-small">Release Year</span>
          <input class="uk-input" type="number" name="movieYear" v-bind:placeholder="currentYear" v-bind:class="{ 'uk-form-danger' : errors.movieYear }" v-on:focus="clearError('movieYear')" v-model="data.movie.releaseYear">
          <span class="uk-text-small uk-text-danger" v-if="errors.movieYear">Please enter a four digit release year</span>
        </div>
        <div class="uk-width-1-1"  v-if="!data.isNew">
          <h2 class="uk-heading-divider uk-text-small uk-text-bold">Stock</h2>
          <ul class="uk-list uk-list-divider uk-text-small">
            <li v-for="movie in data.movie.copiesEdit" class="uk-position-relative" v-bind:class="{ 'uk-text-muted' : movie.status == '1'}" v-if="movie.editStatus < 2">
              {{ movie.id }} <span class="uk-hidden">{{ movie.status }}</span>
              <div class="uk-align-right" v-bind:class="{ 'deleted' : movie.deleted }">
                <span class="uk-label uk-label-danger uk-text-small uk-margin-small-right" v-if="movie.status == 1">Rented</span> 
                <span uk-icon="minus-circle" class="uk-icon" v-on:click="deleteCopy(movie.id)"></span>
              </div>
            </li>
            <li v-else class="uk-position-relative" v-bind:class="{ 'uk-hidden' : movie.status == 2}">
              <del>{{ movie.id }} <span class="uk-hidden">{{ movie.status }} {{ movie.editStatus }}</span></del>
              <div class="uk-align-right" v-bind:class="{ 'deleted' : movie.deleted }">
                <span class="uk-label uk-label-danger uk-text-small uk-margin-small-right" v-if="movie.status == 1">Rented</span> 
                <span uk-icon="plus-circle" class="uk-icon" v-on:click="undeleteCopy(movie.id)"></span>
              </div>
            </li>
            <li><span class="uk-button uk-button-default" v-on:click="addNewCopy(data.movie)">Add New Copy <span uk-icon="plus-circle"></span></span></li>
          </ul>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit(data.movie)" v-if="!data.isNew">Cancel</span>
        </div>
      </form>
      <div v-else>
        <div class="uk-position-relative">
          <span v-if="data.movie.stock==0" class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Out of Stock</span>
          <span v-else class="uk-label uk-label-success uk-text-small uk-position-top-right uk-margin-small-top">{{ data.movie.stock }} In Stock</span>
          <span class="uk-text-small">UPC: {{ $route.params.id }}</span><br />
          <strong>{{ data.movie.title }}</strong><br />
          <span class="uk-text-small">Release year: {{ data.movie.releaseYear }}</span>
          <h2 class="uk-heading-divider uk-text-small uk-text-bold">Stock</h2>
          <ul class="uk-list uk-list-divider uk-text-small">
            <li v-for="movie in data.movie.copies" class="uk-position-relative" v-bind:class="{ 'uk-text-muted' : movie.status == '1' }" v-if="movie.status == 0 || movie.status == 1">{{ movie.id }}<span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top" v-if="movie.status == 1">Rented</span></li>
          </ul>
          <div class="uk-alert uk-alert-danger" v-if="data.movie.copies.length < 1">This movie has been deleted! No copies exist in the sytem!</div>
        </div>
      </div>
    </div>
    <div v-else>
      <!--movie search view-->
      <label class="uk-form-label uk-text-large uk-text-muted uk-margin uk-display-block" for="movieKeyword">Find a Movie</label>
      <div class="uk-search uk-search-default uk-width-1-1">
        <input type="search" placeholder="Enter Movie Title or ISBN" class="uk-input" id="movieKeyword" name="movieKeyword" v-on:keyup.enter="search">  
        <button v-on:click="search" class="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon></button>
      </div>
      <div v-if="data.movies" class="uk-margin-top">
        <hr>
        <!--loop over results-->
        <ul class="uk-list uk-list-divider">
          <!--move style to cutom css-->
          <li v-for="movie in data.movies" class="uk-position-relative" v-on:click="view(movie)">
            <span v-if="!movie.inStock" class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Out of Stock</span>
            <span class="uk-text-small">{{ movie.upc }}</span><br />
            <strong>{{ movie.title }}</strong><br />
            <span class="uk-text-small">{{ movie.releaseYear }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'movie',
    props: ['data'],
    data() {
      return {
        availableMovies: 0,
        movieToView: null,
        hasError: false,
        copiesToDelete: [],
        errors: {
          movieTitle: false,
          movieYear: false,
          movieUpc: false,
          movieQty: false
        }
      }
    }, 
    methods: {
      search() {
        //TODO validate for null query
        console.log("emit search");
        var query = document.querySelector("input[name=movieKeyword]").value;
        this.$router.app.$emit('searchMovie', query);
      },
      view(movie) {
        console.log('emit view view');
        console.log(movie);
        this.$router.app.$emit('viewMovie', movie);
      },
      editForm(id) {
        //this.$router.app.$emit('cancelEdit');
        console.log('emit edit movie '+id);
        this.$router.app.$emit('editMovie',id);
      },
      deleteAll() {
        var params = {
          upc: data.movie.upc,
          hasEdits: false,
          delete: null,
          deleteAll: true
        }
        this.$router.app.$emit('updateMovie', params);
      },
      clearError(input) {
        this.errors[input] = false;
      },
      deleteCopy(id){
        this.$router.app.$emit('deleteCopy', id);
        if (id[0] != '[') {
          //add to delete list
          this.copiesToDelete.push(id);
        }
      },
      undeleteCopy(id){
        this.$router.app.$emit('undeleteCopy', id);
        var index = this.copiesToDelete.indexOf(id);
        if (index > -1) {
          this.copiesToDelete.splice(index,1);
        }
      },
      addNewCopy(movie) {
        var copy = {
          id: "[NEW ITEM] "+movie.upc,
          status: 0,
          editStatus: 1
        }
        this.$router.app.$emit('addCopy',copy);
      },
      /*
      addToCopies() {
        var copy = document.querySelector("input[name=addCopy]");
        //validate input data
        var copyId = copy.value.replace(/\D/g,'');
        if (copyId.length == 10) {
          this.$router.app.$emit('addCopy',copyId);
        }
        else {
          this.errors.addCopy = true;
        }
      },*/
      handleSubmit(data) {
        //check text inputs for content
        this.hasError = false;
        //check for missing inputs -- fix null error
        for (var input in this.errors) {
          var inputField = document.querySelector("input[name="+input+"]");
          if (inputField === null) {
            continue;
          }
          var inputVal= inputField.value;
          //check for empty inputs
          //TODO trim whitespace
          if (inputVal.length < 1 && input != "movieYear") {
            this.errors[input] = true;
            this.hasError = true;
          }
          else {
            if (input == "movieUpc" && inputVal != inputVal.replace(/\D/g,'')) {
              //UPC has chars that aren't integers
              this.errors[input] = true;
              this.hasError = true;
            }
            else if (input == "movieYear" && inputVal.length > 0) {
              var movieYear = parseInt(inputVal);
              var today = new Date();
              if (movieYear < 1888 || movieYear > today.getFullYear()) {
                //year is out of range
                this.errors[input] = true;
                this.hasError = true;
              }
            }
            else if (input == "movieQty" && parseInt(inputVal) < 1) {
              //quantity under minimum
              this.errors[input] = true;
              this.hasError = true;
            }
          }
        }
        if (!this.hasError) {
          console.log(data.movie);
          if (data.isNew) {
            data.movie.qty = 1;//hardcode movie qtq
            this.$router.app.$emit('createMovie');
          }
          else {
            var hasEdits = false;
            for (var key in data.movie.editRef) {
              console.log(key);
              console.log(data.movie[key]);
              console.log(data.movie.editRef[key]);
              if (data.movie[key] != data.movie.editRef[key]) {
                hasEdits = true;
                console.log('has edits to movie fields')
                break;
              }
            }
            var params = {
              upc: data.movie.upc,
              hasEdits: hasEdits,
              delete: this.copiesToDelete,
              deleteAll: false
            }
            console.log('emit updateMovie');
            this.$router.app.$emit('updateMovie', params);
          }
        }
        else {
          for (i in this.erorrs) {
            console.log(this.errors[i])
          }
        }
      },
      cancelEdit(movie) {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        //reset to initial values
        //this.$router.app.$emit('cancelEdit');
        this.$router.app.$emit('viewMovie',movie);
      }
    },
    computed: {
      currentYear: function(){
        var today = new Date();
        return today.getFullYear();
      }
      /*
      //moved to method in app
      stockCount: function() {
        //var availableMovies = 0;
        //$route.params.id
        var id = this.movieToView;
        var totalAvailable = 0;
        for (var i = 0; i< this.$router.app.data.selected[id].copies.length; i++) {
          console.log(this.$router.app.data.selected[id].copies[i].inStock);
          if (this.$router.app.data.selected[id].copies[i].inStock == true) {
            totalAvailable++;
          }
        }
        return totalAvailable;
      }*/
    }
  }
</script>