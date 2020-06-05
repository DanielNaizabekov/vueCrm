<template>
  <div class="form-layout">
    <div class="form-wrapper">
      <h2 class="form-title">{{title}}</h2>

      <slot></slot>

      <div class="form-action-wrapper">
        <slot name="form-action"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'login',
    },
  },
}
</script>

<style scoped>
.form-layout {
  min-height: 100vh;
  background: #2A2E37;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
}
.form-wrapper {
  width: 500px;
  background: #fff;
  border-radius:5px;
  overflow: hidden;
  margin: 0 15px;
}
.form-title {
  font-weight: 400;
  text-transform: uppercase;
  color: #414141;
  padding: 40px 40px 20px 40px;
}
.form-action-wrapper {
  display: flex;
  justify-content: space-between;
}
.form-action-btn {
  flex: 1;
  outline: none;
  padding: 20px 0;
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  transition: .5s;
  position: relative;
}
.left-btn {
  background: #6D4C41;
}
.right-btn {
  background: #546E7A;
}
.left-btn:hover {
  padding-left: 15px;
}
.right-btn:hover {
  padding-right: 15px;
}
</style>

<style>
.form-layout .primary--text,
.reset-password-form .primary--text {
  color: #1D1D1D !important;
  caret-color: #1D1D1D !important;
}
.form-layout .v-text-field .v-label,
.reset-password-form .v-text-field .v-label {
  text-transform: uppercase;
  font-size: 13px;
  left: 20px !important;
}
.form-layout .v-input input {
  padding-left: 20px;
}
</style>