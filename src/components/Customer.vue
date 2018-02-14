<template>
  <div class="uk-section">
    <div v-if="data.customers">
      <!--customer search-->
    </div>
    <div v-else >
      CUSTOMER SEARCH FORM
    </div>
  </div>
</template>

<script>
  export default {
    name: 'customer',
    props: ['data']
  }
</script>