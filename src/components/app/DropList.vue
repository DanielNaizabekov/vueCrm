<template>
  <div ref="wrapper" class="wrapper">
    <slot name="activator"></slot>

    <div v-show="isOpen" ref="inner" class="inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const MAX_INNER_HEIGHT = 300;

export default {
  data() {
    return {
      isOpen: false,
      documentBody: null,
      closeHandler: () => {},
    };
  },
  watch: {
    isOpen(v) {
      v ? this.documentBody.addEventListener('click', this.closeHandler)
      : this.documentBody.removeEventListener('click', this.closeHandler);
    },
  },
  methods: {
    setDefaultPosition(inner) {
      inner.style.top = '100%';
      inner.style.bottom = 'auto';
      inner.style.maxHeight = MAX_INNER_HEIGHT + 'px';
    },
    setPosition() {
      const wrapper = this.$refs.wrapper;
      const inner = this.$refs.inner;
      this.setDefaultPosition(inner);
      
      const isOverflowBottom = inner.getBoundingClientRect().bottom >= window.innerHeight;
      const isOverflowTop = wrapper.getBoundingClientRect().top < MAX_INNER_HEIGHT;

      if(isOverflowBottom && isOverflowTop) {
        inner.style.maxHeight = window.innerHeight - inner.getBoundingClientRect().top + 'px';
      } else if (isOverflowBottom) {
        inner.style.top = 'auto';
        inner.style.bottom = '100%';
      }
    },
    onOpen() {
      !this.isOpen && (this.isOpen = true);
      this.$nextTick(() => this.setPosition());
    },
  },
  mounted() {
    this.documentBody = document.querySelector('body');
    this.closeHandler = () => {
      this.isOpen = false;
      this.$emit('onClose');
    };
  },
}
</script>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
}

.inner {
  width: 100%;
  position: absolute;
  top: 100%;
  z-index: 100;
  max-height: 300px;
  overflow: auto;
  box-shadow: 0px 4px 15px -8px rgba(0, 0, 0, .75);
}
</style>