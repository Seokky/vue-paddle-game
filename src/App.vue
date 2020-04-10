<template>
  <div id="app">
    <canvas
      id="canvas"
      ref="canvas"
      :style="styles"
      @mousemove="onMouseMove"
      @touchmove="onTouchMove"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { MIN_BALL_RADIUS } from '@/constants';
import { shapesDrawer } from '@/classes/ShapesDrawer';

/*
  TODO: make speed dynamic depends on width and height
  TODO: rounded paddle rect
  TODO: touch-friendly
  TODO: dynamical paddle width
  TODO: make default paddle X centered
*/

export default Vue.extend({
  name: 'App',

  data() {
    return {
      paddle: {
        width: 100,
        height: 30,
        x: 10,
      },
      ball: {
        x: 35,
        y: 35,
        speedX: 5,
        speedY: 5,
      },
    };
  },

  computed: {
    ...mapGetters({
      canvasWidth: 'moduleCanvas/width',
      canvasHeight: 'moduleCanvas/height',
      canvasStyles: 'moduleCanvas/styles',
      canvasContext: 'moduleCanvas/context',
    }),
    styles() {
      return this.canvasStyles;
    },
    ballRadius() {
      const proportionalRadius = (this.canvasWidth / 100) * 2;

      return Math.min(MIN_BALL_RADIUS, proportionalRadius);
    },
  },

  async mounted() {
    await this.$store.dispatch('moduleCanvas/init');
    shapesDrawer.init(this.canvasContext);

    this.drawAll();

    window.addEventListener('resize', this.onResize);
  },

  methods: {
    moveBall() {
      this.ball.x += this.ball.speedX;
      this.ball.y += this.ball.speedY;

      const MIN_X = this.ballRadius;
      const MIN_Y = this.ballRadius;
      const MAX_X = this.canvasWidth - this.ballRadius;
      const MAX_Y = this.canvasHeight - this.ballRadius;

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
      this.clearCanvas();
      this.drawBall();
      this.drawPaddle();

      window.requestAnimationFrame(this.drawAll);
    },
    drawPaddle() {
      const { x, width, height } = this.paddle;
      const y = this.canvasHeight - this.paddle.height;

      shapesDrawer.fillRect(x, y, width, height, 'orange');
    },
    drawBall() {
      shapesDrawer.fillCircle(
        this.ball.x,
        this.ball.y,
        this.ballRadius,
        'orange',
      );
    },
    clearCanvas() {
      this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    toggleFullscreen(): void {
      return document.fullscreenElement
        ? document.exitFullscreen()
        : this.$refs.canvas.requestFullscreen();
    },
    isCursorShouldBeHandled(e: MouseEvent | TouchEvent) {
      const minAvailableX = this.paddle.x;
      const maxAvailableX = this.paddle.x + this.paddle.width;
      const touchX = e.touches[0].clientX;

      if (touchX < minAvailableX || touchX > maxAvailableX) {
        return false;
      }

      return true;
    },
    onMouseMove(e: MouseEvent) {
      /* mouse position relative to canvas element */
      const rect = e.target.getBoundingClientRect();
      const touchX = e.clientX - rect.left;

      this.movePaddle(touchX - this.paddle.width / 2);
    },
    onTouchMove(e: TouchEvent) {
      if (!this.isCursorShouldBeHandled(e)) {
        return;
      }

      const touchX = e.touches[0].clientX;
      const newPaddleX = touchX - this.paddle.width / 2;

      this.movePaddle(newPaddleX);
    },
    movePaddle(x: number) {
      let newPaddleX = x;

      const minPaddleX = (this.paddle.width / 2) * -1;
      const maxPaddleX = this.canvasWidth - this.paddle.width / 2;

      if (x < minPaddleX) {
        newPaddleX = minPaddleX;
      }

      if (x > maxPaddleX) {
        newPaddleX = maxPaddleX;
      }

      this.paddle.x = newPaddleX;
    },
    async onResize() {
      await this.$store.dispatch('moduleCanvas/init');
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
