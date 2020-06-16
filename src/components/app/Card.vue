<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  border-radius: 7px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .2);
  padding: 30px;
}
@media(max-width: 450px)  {
  .card {
    padding: 15px;
  }
}
</style>