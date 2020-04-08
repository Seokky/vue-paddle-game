<template>
  <div id="app">
    <canvas
      id="canvas"
      ref="canvas"
      :style="canvas.styles"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { canvas } from '@/Canvas';

export default Vue.extend({
  name: 'App',

  provide: { canvas },

  data() {
    return {
      speedX: 5,
      speedY: 5,
      lineWidth: 10,
      ball: {
        x: 35,
        y: 35,
        width: 40,
        height: 40,
      },
    };
  },

  computed: {
    canvas(): HTMLCanvasElement {
      return canvas.el;
    },
    context(): CanvasRenderingContext2D {
      return canvas.context;
    },
  },

  async mounted() {
    await canvas.init();

    this.drawBorder();
    this.drawAll();

    window.addEventListener('resize', this.onResize);
  },

  methods: {
    toggleFullscreen(): void {
      return document.fullscreenElement
        ? document.exitFullscreen()
        : this.$refs.canvas.requestFullscreen();
    },
    async onResize() {
      await canvas.init();
      this.drawBorder();
    },
    drawAll() {
      this.moveBall();

      this.drawMainArea();
      this.drawBall();

      window.requestAnimationFrame(this.drawAll);
    },
    drawBall() {
      this.context.fillStyle = 'orange';
      this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
    },
    drawBorder() {
      this.context.fillStyle = 'blue';
      this.context.lineWidth = this.lineWidth;
      this.context.fillRect(
        0,
        0,
        canvas.sizes.width,
        canvas.sizes.height,
      );
    },
    drawMainArea() {
      this.context.clearRect(
        this.lineWidth,
        this.lineWidth,
        canvas.sizes.width - this.lineWidth * 2,
        canvas.sizes.height - this.lineWidth * 2,
      );
    },
    moveBall() {
      this.ball.x += this.speedX;
      this.ball.y += this.speedY;

      const MIN_X = this.lineWidth;
      const MIN_Y = this.lineWidth;
      const MAX_X = canvas.sizes.width - this.lineWidth - this.ball.width;
      const MAX_Y = canvas.sizes.height - this.lineWidth - this.ball.height;

      if (this.ball.x >= MAX_X) {
        this.ball.x = MAX_X;
        this.speedX *= -1;
      }

      if (this.ball.x <= MIN_X) {
        this.ball.x = MIN_X;
        this.speedX *= -1;
      }

      if (this.ball.y >= MAX_Y) {
        this.ball.y = MAX_Y;
        this.speedY *= -1;
      }

      if (this.ball.y <= MIN_Y) {
        this.ball.y = MIN_Y;
        this.speedY *= -1;
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/reset';

html {
  overflow: hidden;
}

#canvas {
  background: lightblue;
}
</style>
