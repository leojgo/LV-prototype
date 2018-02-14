<template>
  <div class="uk-section">
    <div v-if="data.report">
      <!--movie search-->
    </div>
    <div v-else >
      MOVIE SEARCH FORM
    </div>
  </div>
</template>

<script>
  export default {
    name: 'report',
    props: ['data']
  }
</script>