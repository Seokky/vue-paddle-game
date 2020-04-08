<template>
  <div id="app">
    <canvas
      id="canvas"
      ref="canvas"
      :style="styles"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { MIN_BALL_RADIUS } from '@/constants';
import { canvas } from '@/classes/Canvas';
import { shapesDrawer } from '@/classes/ShapesDrawer';

/*
  TODO: make speed dynamic depends on width and height
*/

export default Vue.extend({
  name: 'App',

  provide: { canvas },

  data() {
    return {
      ball: {
        x: 35,
        y: 35,
        speedX: 5,
        speedY: 5,
      },
    };
  },

  computed: {
    styles() {
      return canvas.styles;
    },
    ballRadius() {
      const proportionalRadius = (canvas.width / 100) * 2;

      return Math.min(MIN_BALL_RADIUS, proportionalRadius);
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
      this.ball.x += this.ball.speedX;
      this.ball.y += this.ball.speedY;

      const MIN_X = this.ballRadius;
      const MIN_Y = this.ballRadius;
      const MAX_X = canvas.width - this.ballRadius;
      const MAX_Y = canvas.height - this.ballRadius;

      if (this.ball.x >= MAX_X) {
        this.ball.x = MAX_X;
        this.ball.speedX *= -1;
      }

      if (this.ball.x <= MIN_X) {
        this.ball.x = MIN_X;
        this.ball.speedX *= -1;
      }

      if (this.ball.y >= MAX_Y) {
        this.ball.y = MAX_Y;
        this.ball.speedY *= -1;
      }

      if (this.ball.y <= MIN_Y) {
        this.ball.y = MIN_Y;
        this.ball.speedY *= -1;
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
        this.ballRadius,
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
  background-color: lightgray;
}

#app {
  height: 100vh;
  display: flex;
  align-items: center;
}

#canvas {
  background: #2c1f34;
  display: block;
  margin: 0 auto;
  box-shadow: 0 0 10px #2c1f34;
}
</style>
