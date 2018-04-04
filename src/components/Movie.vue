<template>
  <div class="uk-section">
    <div class="uk-alert-danger uk-text-small" uk-alert>
      <!--<a class="uk-alert-close" uk-close></a>-->
      <p>Prototyope for placement only -- not for functional review!</p>
    </div>
    <div v-if="data.isSingle">
      <!--single movie view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Movie Title</h1>
      <h1 v-else class="uk-text-large" style="position: relative">Movie Title
        <ul class="uk-iconnav uk-position-top-right">
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><span uk-icon="close" v-on:click="cancelEdit(data.movie.upc)"></span></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><span  uk-icon="pencil" v-on:click="editForm(data.movie.upc)"></span></li>
          <li v-if="data.isManager"><span uk-icon="icon: trash"></span></li>
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
          <input class="uk-input" type="number" name="movieYear" placeholder="2018" v-bind:class="{ 'uk-form-danger' : errors.movieYear }" v-on:focus="clearError('movieYear')" v-model="data.movie.releaseYear">
          <span class="uk-text-small uk-text-danger" v-if="errors.movieYear">Please enter a four digit release year</span>
        </div>
        <div class="uk-width-1-2@s" v-if="data.isNew">
          <span class="uk-text-small">Number of copies to add</span>
          <input type="number" class="uk-input" placeholder="1" v-model="data.movie.qty" name="movieQty" v-bind:class="{ 'uk-form-danger' : errors.movieQty }" v-on:focus="clearError('movieQty')"/>
          <span class="uk-text-small uk-text-danger" v-if="errors.movieQty">Please add one or more copies</span>
        </div>
        <div class="uk-width-1-1"  v-if="!data.isNew">
          <h2 class="uk-heading-divider uk-text-small uk-text-bold">Stock</h2>
          <ul class="uk-list uk-list-divider uk-text-small">
            <li v-for="movie in data.movie.copies" v-if="movie.status == 0" class="uk-position-relative">{{ movie.upc }}</li>
            <li v-for="movie in data.movie.copies" v-if="movie.status == 1" class="uk-text-muted uk-position-relative">{{ movie.upc }} <span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Rented</span></li>
            <li><button class="uk-button uk-button-default" v-on:click="addCopy">Add New Copy <span uk-icon="plus-circle"></span></button></li>
          </ul>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit(data.movie.upc)" v-if="data.isNew == false">Cancel</span>
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
            <li v-for="movie in data.movie.copies" v-if="movie.status == 0" class="uk-position-relative">{{ movie.id }}</li>
            <li v-for="movie in data.movie.copies" v-if="movie.status == 1" class="uk-text-muted uk-position-relative">{{ movie.id }} <span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Rented</span></li>
          </ul>
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
          <li v-for="movie in data.movies" class="uk-position-relative" v-on:click="view(movie.upc)">
            <span v-if="movie.stock == 0" class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Out of Stock</span>
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
        copiesAdded: 0,
        copiesToDelete: [],
        hasError: false,
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
        console.log("emit search");
        var query = document.querySelector("input[name=movieKeyword]").value;
        this.$router.app.$emit('searchMovie', query);
      },
      view(upc) {
        console.log('emit view view');
        this.$router.app.$emit('viewMovie', upc);
      },
      editForm(id) {
        //this.$router.app.$emit('cancelEdit');
        console.log('emit edit movie '+id);
        this.$router.app.$emit('editMovie',id);
      },
      clearError(input) {
        this.errors[input] = false;
      },
      deleteCopy(id){
        this.copiesToDelete.push(id);
        this.$router.emit('deleteMovieCopy');
      },
      addCopy() {
        this.copiesAdded++;
        this.$router.emit('createMovieCopy');
      },
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
      },
      handleSubmit(data) {
        //check text inputs for content
        this.hasError = false;
        //check for missing inputs
        for (var input in this.errors) {
          var inputVal= document.querySelector("input[name="+input+"]").value;
          //check for empty inputs
          //TODO trim whitespace
          if (inputVal.length < 1) {
            this.errors[input] = true;
            this.hasError = true;
          }
          else {
            if (input == "movieUpc" && inputVal != inputVal.replace(/\D/g,'')) {
              //UPC has chars that aren't integers
              this.errors[input] = true;
              this.hasError = true;
            }
            else if (input == "movieYear") {
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
            this.$router.app.$emit('createMovie');
          }
          else {
            this.$router.app.$emit('updateMovie');
          }
        }
      },
      cancelEdit(upc) {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        //reset to initial values
        this.$router.app.$emit('cancelEdit');
        this.$router.app.$emit('viewMovie',upc);
      }
    },
    computed: {
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