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
import { canvas } from '@/classes/Canvas';
import { shapesDrawer } from '@/classes/ShapesDrawer';

export default Vue.extend({
  name: 'App',

  provide: { canvas },

  data() {
    return {
      speedX: 5,
      speedY: 5,
      ball: {
        x: 35,
        y: 35,
        radius: 55,
      },
    };
  },

  computed: {
    canvas(): HTMLCanvasElement {
      return canvas.el;
    },
  },

  async mounted() {
    await canvas.init();
    shapesDrawer.init(canvas.context);

    this.drawAll();

    window.addEventListener('resize', this.onResize);
  },

  methods: {
    moveBall() {
      this.ball.x += this.speedX;
      this.ball.y += this.speedY;

      const MIN_X = this.ball.radius;
      const MIN_Y = this.ball.radius;
      const MAX_X = canvas.width - this.ball.radius;
      const MAX_Y = canvas.height - this.ball.radius;

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
    drawAll() {
      this.moveBall();
      this.drawBall();

      window.requestAnimationFrame(this.drawAll);
    },
    drawBall() {
      canvas.context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      shapesDrawer.fillCircle(
        this.ball.x,
        this.ball.y,
        this.ball.radius,
        'orange',
      );
    },
    toggleFullscreen(): void {
      return document.fullscreenElement
        ? document.exitFullscreen()
        : this.$refs.canvas.requestFullscreen();
    },
    async onResize() {
      await canvas.init();
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
