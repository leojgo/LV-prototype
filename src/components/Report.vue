<template>
  <div class="uk-section">
    <nav>
      <a href="">Overdue Rentals</a>
      <a href="">Popular Movies</a>
    </nav>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Due Date</th>
            <th>Days Overdue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'report',
    props: ['data']
  }
</script>