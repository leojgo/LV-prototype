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
          <li v-bind:class="{'uk-hidden' : data.isEdit == false}"><a href="#" uk-icon="close" v-on:click="cancelEdit"></a></li>
          <li v-bind:class="{'uk-hidden' : data.isEdit}"><a href="#" uk-icon="pencil" v-on:click="editForm($route.params.id)"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <!--maybe can combine-->
      <form v-for="(movie, id) in data.selected" v-if="data.isEdit" class="uk-form" uk-grid @submit.prevent="handleSubmit">
        <span class="uk-text-small">ISBN: {{ id }}</span><br />
        <div class="uk-width-1-1">
          <input class="uk-input" type="text" name="movieTitle" placeholder="Movie Title" v-bind:class="{ 'uk-form-danger' : errors.movieTitle }" v-on:focus="clearError('movieTitle')" v-model="movie.title">
        </div>
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" name="movieYear" placeholder="2018" v-bind:class="{ 'uk-form-danger' : errors.movieYear }" v-on:focus="clearError('movieYear')" v-model="movie.year">
        </div>
        <div class="uk-width-1-1@s uk-margin" v-if="data.isNew == false">
          <h2 class="uk-heading-divider uk-text-small uk-text-bold">Stock</h2>
          <!--show all existing elements with delete icon-->
          <ul class="uk-list uk-list-divider uk-text-small" id="stockList">
            <li v-for="copy in movie.copies" v-if="copy.inStock" class="uk-position-relative">{{ copy.id }} <span uk-icon="trash" class="uk-position-top-right uk-margin-small-top" v-on:click="clearItem"></span></li>
            <li v-for="copy in movie.copies" v-if="copy.inStock == false" class="uk-text-muted uk-position-relative">{{ copy.id }} <span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Rented</span></li>
            <div class="uk-inline uk-margin uk-width-1-1">
              <input class="uk-input" type="text" name="addCopy" placeholder="9929398450" v-bind:class="{ 'uk-form-danger' : errors.addCopy }" v-on:focus="clearError('addCopy')"><a class="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: plus-circle" v-on:click="addToCopies"></a>
            </div>
            <label class="uk-form-label" for="addCopy">Enter ID and click the "+" button to add a copy</label>
          </ul>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <span class="uk-button uk-button-default uk-margin-left" v-on:click="cancelEdit" v-if="data.isNew == false">Cancel</span>
        </div>
      </form>
      <div v-else>
        <div v-for="(movie, id) in data.selected" class="uk-position-relative">
          <span v-if="movie.noStock" class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Out of Stock</span>
          <span v-else class="uk-label uk-label-success uk-text-small uk-position-top-right uk-margin-small-top">{{ stockCount }} In Stock</span>
          <span class="uk-text-small">ISBN: {{ $route.params.id }}</span><br />
          <strong>{{ movie.title }}</strong><br />
          <span class="uk-text-small">Release year: {{ movie.year }}</span>
          <h2 class="uk-heading-divider uk-text-small uk-text-bold">Stock</h2>
          <ul class="uk-list uk-list-divider uk-text-small">
            <li v-for="copy in movie.copies" v-if="copy.inStock" class="uk-position-relative">{{ copy.id }} <!--<span class="uk-label uk-label-success uk-text-small uk-position-top-right uk-margin-small-top">Available</span>--></li>
            <li v-for="copy in movie.copies" v-if="copy.inStock == false" class="uk-text-muted uk-position-relative">{{ copy.id }} <span class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Rented</span></li>
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
          <li v-for="(movie, id) in data.movies" style="position: relative" v-on:click="view(id)">
            <span v-if="movie.noStock" class="uk-label uk-label-danger uk-text-small uk-position-top-right uk-margin-small-top">Out of Stock</span>
            <span class="uk-text-small">{{ id }}</span><br />
            <strong>{{ movie.title }}</strong><br />
            <span class="uk-text-small">{{ movie.year }}</span>
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
        errors: {
          movieTitle: false,
          movieYear: false
        }
      }
    }, 
    methods: {
      search() {
        console.log("emit search");
        var query = document.querySelector("input[name=movieKeyword]").value;
        this.$router.app.$emit('searchMovie', query);
      },
      view(id) {
        this.movieToView = id;
        console.log('view '+this.movieToView);
        this.$router.app.$emit('viewMovie', id);
      },
      editForm(id) {
        //this.cancelEdit();
        this.movieToEdit = id;
        this.$router.app.$emit('cancelEdit');
        this.$router.app.$emit('editMovie',id);
      },
      clearError(input) {
        this.errors[input] = false;
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
      clearItem() {
        //TODO
      },
      handleSubmit() {
        //check text inputs for content
        //check for valid phone
        var hasError = false;
        //check for missing inputs
        for (var input in this.errors) {
          console.log(document.querySelector("input[name="+input+"]"))
          if (document.querySelector("input[name="+input+"]").value.length < 1) {
            this.errors[input] = true;
            hasError = true;
          }
        }
        if (hasError) {
          //show error messages
        }
        else {
          var newMovie = {
            title: document.querySelector("input[name=movieTitle]").value,
            year: document.querySelector("input[name=movieYear]").value,
            copies: null,
            noStock: true
          }
          //loop over copies
          if (this.$router.app.data.isNew) {
            this.$router.app.$emit('addMovie', newMovie);
          }
          else {
            this.$router.app.$emit('updateMovie', this.movieToEdit);
          }
        }
      },
      cancelEdit() {
        //get rid of any error highlighting
        for (var input in this.errors) {
          this.errors[input] = false;
        }
        //reset to initial values
        this.$router.app.$emit('cancelEdit');
        this.$router.app.$emit('viewMovie', this.movieToEdit);
      }
    },
    computed: {
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
      }
    }
  }
</script>