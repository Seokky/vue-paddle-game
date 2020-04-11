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
import { canvas } from '@/classes/Canvas';
import { ball } from '@/classes/Ball';
import { paddle } from '@/classes/Paddle';
import { shapesDrawer } from '@/classes/ShapesDrawer';

/*
  TODO: make speed dynamic depends on width and height
  TODO: make paddle w and h dynamic depends on width and height
  TODO: rounded paddle rect
  TODO: touch-friendly
  TODO: dynamical paddle width
  TODO: make default paddle X centered
*/

export default Vue.extend({
  name: 'App',

  computed: {
    styles() {
      return canvas.styles;
    },
  },

  async mounted() {
    await this.initApp();
    this.drawAll();

    window.addEventListener('resize', this.onResize);
  },

  methods: {
    async initApp() {
      await canvas.init();
      ball.init(canvas.width, canvas.height);
      paddle.init(canvas.width, canvas.height);
      shapesDrawer.init(canvas.context);
    },

    async onResize() {
      await this.initApp();
    },

    drawAll() {
      canvas.clear();
      ball.move();
      this.drawBall();
      this.drawPaddle();

      window.requestAnimationFrame(this.drawAll);
    },

    drawBall() {
      shapesDrawer.fillCircle(
        ball.x,
        ball.y,
        ball.radius,
        ball.color,
      );
    },

    drawPaddle() {
      shapesDrawer.setShadow(0, 0, 10, paddle.shadowColor);
      shapesDrawer.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        paddle.color,
      );
    },

    toggleFullscreen() {
      return document.fullscreenElement
        ? document.exitFullscreen()
        : canvas.el.requestFullscreen();
    },

    onMouseMove(e: MouseEvent) {
      /* mouse position relative to canvas element */
      const target = e.target! as HTMLElement;
      const rect = target.getBoundingClientRect();
      const touchX = e.clientX - rect.left;

      paddle.move(touchX - paddle.width / 2);
    },

    onTouchMove(e: TouchEvent) {
      if (!this.isCursorShouldBeHandled(e)) {
        return;
      }

      const touchX = e.touches[0].clientX;
      const newPaddleX = touchX - paddle.width / 2;

      paddle.move(newPaddleX);
    },

    isCursorShouldBeHandled(e: TouchEvent) {
      const minAvailableX = paddle.x;
      const maxAvailableX = paddle.x + paddle.width;
      const touchX = e.touches[0].clientX;

      if (touchX < minAvailableX || touchX > maxAvailableX) {
        return false;
      }

      return true;
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
