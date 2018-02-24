<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      <!--single customer view-->
      <h1 v-if="data.isNew" class="uk-text-large uk-text-muted">Create Movie Title</h1>
      <h1 v-else class="uk-text-large" style="position: relative">View Movie Title 
        <ul class="uk-iconnav uk-position-top-right">
          <li v-if="data.isEdit"><a href="#" uk-icon="icon: close"></a></li>
          <li v-if="data.isEdit == false"><a href="#" uk-icon="icon: pencil"></a></li>
          <li v-if="data.isManager"><a href="#" uk-icon="icon: trash"></a></li>
        </ul>
      </h1> 
      <div v-if="data.isEdit" lass="uk-form" uk-grid>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" placeholder="John" :value="data.selected.name">
        </div>
        <div class="uk-width-1-2@s">
            <input class="uk-input" type="text" placeholder="Smith" :value="data.selected.name">
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" placeholder="Address Line">
        </div>
        <!--City/State: assume all local addresses-->
        <div class="uk-width-1-2@s">
          <input class="uk-input" type="text" placeholder="City">
        </div>
        <div class="uk-width-1-2@s">
          <div class="uk-form-controls">
            <select class="uk-select" id="form-stacked-select">
                <option>Alabama</option>
                <option>Alaska</option>
                <option>Illinois</option>
                <option>Wisconsin</option>
            </select>
          </div>
        </div>
        <!--change to multiple fields for US numbers and an alternate for int'l?-->
        <div class="uk-width-1-1">
            <!--add label-->
            <input class="uk-input" type="text" placeholder="800-588-2300">
            <!--add help text-->
        </div>
        <div class="uk-width-1-1">
            <input class="uk-input" type="text" placeholder="you@example.com">
        </div>
        <div class="uk-width-1-1">
          <label><input class="uk-checkbox" type="checkbox" checked> Add to Mailing List</label>
        </div>
        <div class="uk-width-1-1">
          <button class="uk-button uk-button-primary">Save</button>
          <button class="uk-button uk-button-default uk-margin-left">Cancel</button>
        </div>
      </div>
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
        movieToView: null
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
        this.$router.app.$emit('viewMovie', id);
      },
    },
    computed: {
      stockCount: function() {
        //var availableMovies = 0;
        //$route.params.id
        var id = this.movieToView;
        console.log(id);
        for (var i = 0; i< this.$router.app.data.selected[id].copies.length; i++) {
          console.log(this.$router.app.data.selected[id].copies[i].inStock);
          if (this.$router.app.data.selected[id].copies[i].inStock == true) {
            this.availableMovies++;
          }
        }
        return this.availableMovies;
      }
    }
  }
</script>