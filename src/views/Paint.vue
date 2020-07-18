<template>
  <div class="paint-page">
    <header ref="paintHeader" class="paint-header">
      <v-banner single-line>
        <div class="d-flex justify-end align-center">

          <v-menu transition="scroll-x-transition">
            <template #activator="{ on: menu }">
              <v-tooltip open-delay="700" bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn
                    tile small icon color="#393939"
                    v-on="{...menu, ...tooltip}"
                  >
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
                  <v-btn
                    @click="removeActiveClasses"
                    class="ml-3"
                    tile small icon color="#393939"
                    v-on="{...menu, ...tooltip}"
                  >
                    <v-icon>palette</v-icon>
                  </v-btn>
                </template>
                <span>Change line color</span>
              </v-tooltip>
            </template>
            <div @click.stop>
              <v-color-picker flat v-model="models.lineColor" hide-inputs/>
            </div>
            <div class="d-flex justify-end pa-3 pt-0"><v-btn small>Ok</v-btn></div>
          </v-menu>

          <v-tooltip open-delay="700" bottom>
            <template #activator="{ on }">
              <v-btn
                class="ml-3"
                @click="clear(); removeActiveClasses();"
                tile small icon color="#393939"
                v-on="on"
              >
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
                @click.stop="takeRubber"
                tile small icon color="#393939"
                v-on="on"
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
      @mousedown="canvMousedown"
      @mouseleave="canvMouseleave"
      @mousemove="canvMousemove"
      @touchmove="canvTouchmove"
      @touchend="canvTouchend"
      ref="canvas"
      id="canvas"
      :style="`cursor: url(${cursorType.size}) ${cursorType.offset} ${cursorType.offset}, crosshair;`"
    />
  </div>
</template>

<script>
import * as rubberSize1 from '../assets/img/rubber-size-1.png';
import * as rubberSize3 from '../assets/img/rubber-size-3.png';
import * as rubberSize5 from '../assets/img/rubber-size-5.png';
import * as rubberSize7 from '../assets/img/rubber-size-7.png';

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
    cursorType() {
      if(!this.isRubberBtnActive) return {size: 0, offset: 0};
      let cursor = {};
      const { lineWidth } = this.styles;
      if(lineWidth === 1) cursor = {size: rubberSize1, offset: '2'};
      else if(lineWidth === 3) cursor = {size: rubberSize3, offset: '4'};
      else if(lineWidth === 5) cursor = {size: rubberSize5, offset: '5'};
      else if(lineWidth === 7) cursor = {size: rubberSize7, offset: '7'};
      return cursor;
    },
  },
  methods: {
    removeActiveClasses() {
      this.isRubberBtnActive = false;
    },
    clear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.models.lineWidth = 0;
      this.models.lineColor = '#000';
    },
    takeRubber() {
      this.isRubberBtnActive = true;
      this.models.lineColor = '#fff';
    },
    drawLine(event) {
      const ctx = this.ctx;
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;
      const { lineWidth, lineColor } = this.styles;

      ctx.lineWidth = lineWidth * 2 + 1;
      ctx.strokeStyle = lineColor;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = lineColor;
      if(this.isRubberBtnActive) {
        ctx.fillRect(offsetX - lineWidth, offsetY - lineWidth, lineWidth * 2, lineWidth * 2);
      } else {
        ctx.arc(offsetX, offsetY, lineWidth, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    },
    canvMousedown(event) {
      this.drawLine(event);
      this.isMouseDown = true;
      this.documentBody.addEventListener('mouseup', this.bodyMouseUpHandler);
    },
    canvMouseleave() {
      if(this.isMouseDown) this.ctx.beginPath();
    },
    canvMousemove(event) {
      if(this.isMouseDown) this.drawLine(event);
    },
    canvTouchmove(event) {
      const canvas = this.$refs.canvas;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.touches[0].clientX - rect.left;
      const offsetY = event.touches[0].clientY - rect.top;
      this.drawLine({offsetX, offsetY});
    },
    canvTouchend() {
      this.ctx.beginPath();
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
  background: #E0E0E0;
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