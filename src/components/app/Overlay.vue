<template>
  <div class="overlay">
    <slot></slot>
  </div>
</template>

<style scoped>
.overlay {
  top: 0; right: 0; bottom: 0; left: 0;
  position: absolute;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.5);
}
</style>