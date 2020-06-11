<template>
  <div ref="wrapper" class="wrapper">
    <slot name="activator"></slot>
    
    <transition tag="div">
      <div v-show="isOpen" ref="inner" class="inner">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'transition-card',
  props: ['value'],
  data() {
    return {
      isOpen: null,
      documentBody: null,
      closeHandler: () => {},
    };
  },
  watch: {
    value(v) {
      if(v) {
        this.onOpen();
        this.documentBody.addEventListener('click', this.closeHandler);
      } else {
        this.documentBody.removeEventListener('click', this.closeHandler);
      }
    },
    isOpen(v) {
      this.$emit('input', v);
    },
  },
  methods: {
    getPositions(inner, wrapper) {
      const wrapperOffsetLeft = wrapper.getBoundingClientRect().left;
      const wrapperOffsetRight = wrapper.getBoundingClientRect().right;
      const innerOffsetLeft = inner.getBoundingClientRect().left;
      const innerOffsetRight = inner.getBoundingClientRect().right;
      const innerOffsetBottom = inner.getBoundingClientRect().bottom;
      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = window.innerHeight;

      return {
        wrapperOffsetLeft,
        wrapperOffsetRight,
        innerOffsetLeft,
        innerOffsetRight,
        innerOffsetBottom,
        windowWidth,
        windowHeight,
      };
    },
    onOpen() {
      this.isOpen = true;

      this.$nextTick(() => {
        const wrapper = this.$refs.wrapper;
        const inner = this.$refs.inner;
        const {
          wrapperOffsetLeft,
          wrapperOffsetRight,
          innerOffsetLeft,
          innerOffsetRight,
          innerOffsetBottom,
          windowWidth,
          windowHeight,
        } = this.getPositions(inner, wrapper);

        if(innerOffsetLeft < 0) inner.style.left = -wrapperOffsetLeft + 'px';
        if(innerOffsetRight > windowWidth) inner.style.right = (wrapperOffsetRight - windowWidth) + 'px';
        if(innerOffsetBottom > windowHeight) inner.style.top = -(innerOffsetBottom - windowHeight) + 'px';
      });
    },
  },
  mounted() {
    this.documentBody = document.querySelector('body');
    this.closeHandler = () => this.isOpen = false;
  },
}
</script>

<style scoped>
.wrapper {
  display: inline-flex;
  justify-content: center;
  position: relative;
  z-index: 100;
}

.inner {
  padding: 5px;
  min-width: 80px;
  position: absolute;
}

.v-enter-active, .v-leave-active {
  transition: .4s;
}
.v-enter {
  opacity: 0;
  transform: translateX(-25px);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(25px);
}
</style>