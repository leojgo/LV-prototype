<template>
  <div class="uk-section">
    <div v-if="data.isSingle">
      VIEW MOVIE
    </div>
    <div v-else>
      <!--customer search view-->
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
          <li v-for="(movie, id) in data.movies" style="position: relative" v-on:click="view">
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
    methods: {
      search() {
        console.log("emit search");
        var query = document.querySelector("input[name=movieKeyword]").value;
        this.$router.app.$emit('searchMovie', query);
      },
      view(event) {
        console.log(event);
        console.log(event.target.children[0].textContent);
        this.$router.app.$emit('viewMovie', event.target.children[0].textContent);
      },
    }
  }
</script>