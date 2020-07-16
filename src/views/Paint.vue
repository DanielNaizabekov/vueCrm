<template>
  <div class="paint-page">
    <header ref="paintHeader" class="paint-header">
      <v-banner single-line>
        <div class="d-flex justify-end align-center">

          <v-menu transition="scroll-x-transition">
            <template #activator="{ on: menu }">
              <v-tooltip open-delay="700" bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn tile small icon color="#393939" v-on="{...menu, ...tooltip}">
                    <v-icon>line_weight</v-icon>
                  </v-btn>
                </template>
                <span>Change line width</span>
              </v-tooltip>
            </template>
            <v-list dense>
              <v-list-item-group v-model="models.lineWidth">
                <v-list-item v-for="item in models.lineWidthList" :key="item">
                  <div class="line-width" :style="`height: ${item}px`"/>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-menu transition="scroll-x-transition">
            <template #activator="{ on: menu }">
              <v-tooltip open-delay="700" bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn class="ml-3" tile small icon color="#393939" v-on="{...menu, ...tooltip}">
                    <v-icon>palette</v-icon>
                  </v-btn>
                </template>
                <span>Change line color</span>
              </v-tooltip>
            </template>
            <div @click.stop>
              <v-color-picker v-model="models.lineColor" hide-inputs/>
            </div>
          </v-menu>

          <v-tooltip open-delay="700" bottom>
            <template #activator="{ on }">
              <v-btn class="ml-3" @click="clear" v-on="on" tile small icon color="#393939">
                <v-icon>clear</v-icon>
              </v-btn>
            </template>
            <span>Clear document</span>
          </v-tooltip>

          <v-tooltip open-delay="700" bottom>
            <template #activator="{ on }">
              <v-btn
                class="ml-3 paint-header-btn"
                :class="{active: isRubberBtnActive}"
                @click="takeRubber"
                v-on="on"
                tile
                small
                icon
                color="#393939"
              >
                <v-icon>stay_primary_portrait</v-icon>
              </v-btn>
            </template>
            <span>Take rubber</span>
          </v-tooltip>

        </div>
      </v-banner>
    </header>

    <canvas
      @mousedown="mousedown"
      @mouseleave="mouseleave"
      @mousemove="mousemove"
      ref="canvas"
      id=canvas
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      documentBody: null,
      bodyMouseUpHandler: () => {},
      isMouseDown: false,
      canvasWidth: 0,
      canvasHeight: 0,
      ctx: null,
      isRubberBtnActive: false,
      models: {
        lineWidth: 0,
        lineWidthList: [1, 3, 5, 7],
        lineColor: '#000',
      },
    };
  },
  computed: {
    styles() {
      const lineWidth = this.models.lineWidthList[this.models.lineWidth];
      const lineColor = this.models.lineColor;

      return {lineWidth, lineColor};
    },
  },
  methods: {
    clear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    takeRubber() {
      this.isRubberBtnActive = true;
      this.models.lineColor = '#fff';
    },
    mousedown() {
      this.isMouseDown = true;
      this.documentBody.addEventListener('mouseup', this.bodyMouseUpHandler);
    },
    mouseleave() {
      this.ctx.beginPath();
    },
    mousemove(event) {
      if(!this.isMouseDown) return;
      const ctx = this.ctx;
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const { lineWidth, lineColor } = this.styles;

      ctx.lineWidth = lineWidth * 2 + 1;
      ctx.strokeStyle = lineColor;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(offsetX, offsetY, lineWidth, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    },
  },
  mounted() {
    const contentWrap = document.querySelector('.v-content__wrap');
    const paintHeader = this.$refs.paintHeader;
    const canvas = this.$refs.canvas;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = contentWrap.offsetHeight - paintHeader.offsetHeight;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.ctx = canvas.getContext('2d');

    this.documentBody = document.querySelector('body');
    this.bodyMouseUpHandler = () => {
      this.ctx.beginPath();
      this.isMouseDown = false;
      this.documentBody.removeEventListener('mouseup', this.bodyMouseUpHandler);
    };
  },
}
</script>

<style scoped>
#canvas {
  display: block;
}
.paint-header {
  height: 47px;
}
.paint-header-btn.active {
  background: #EFEFEF;
}

.line-width {
  width: 100px;
  background: #393939;
}
</style>

<style>
.paint-page .v-banner__text {
  width: 100%;
}
</style>