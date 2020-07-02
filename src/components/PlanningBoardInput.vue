<template>
  <div v-if="isOpen" class="board-input-wrapper">
    <input
      class="board-input"
      type="text"
      ref="input"
      @click.stop
      v-model="inputValue"
    />
    <div class="board-input-btns">
      <div @click="submit" class="board-input-btn"><v-icon>done</v-icon></div>
      <div class="board-input-btn"><v-icon>close</v-icon></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
    inputValueProp: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputValue: this.inputValueProp,
      isOpen: false,
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
    inputValueProp(v) {
      this.inputValue = v;
    },
  },
  methods: {
    onOpen() {
      this.isOpen = true;
      this.$nextTick( () => this.$refs.input.select() );
    },
    submit() {
      if ((this.inputValue.trim())) this.$emit('submit', this.inputValue.trim());
    },
  },
  mounted() {
    this.documentBody = document.querySelector('body');
    this.closeHandler = () => this.isOpen = false;
  },
}
</script>

<style scoped>
.board-input-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 40px;
}
.board-input {
  font-size: 15px;
  color: #091E42;
  background: #fff;
  border: 2px solid #4C9AFF;
  border-radius: 3px;
  outline: 0;
  padding: 0 8px;
  width: 100%;
  height: 100%;
}
.board-input-btns {
  position: absolute;
  bottom: -32px;
  right: 0;
  display: flex;
  cursor: default;
}
.board-input-btn {
  width: 32px;
  height: 27px;
  text-align: center;
  margin-left: 5px;
  background: #F5F6F8;
  border-radius: 3px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px;
  transition: background .2s;
}
.board-input-btn i {
  font-size: 17px;
  color: #6D798F;
  line-height: 27px;
}
.board-input-btn:hover {
  background: #ECEDF0;
}
</style>