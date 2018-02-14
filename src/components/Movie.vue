<template>
  <div class="uk-section">
    <div v-if="data.movies">
      <!--movie search-->
    </div>
    <div v-else >
      MOVIE SEARCH FORM
    </div>
  </div>
</template>

<script>
  export default {
    name: 'movie',
    props: ['data']
  }
</script>