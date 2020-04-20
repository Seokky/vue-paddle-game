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
import { TCanvasStyles } from '@/types/TCanvasStyles';
import { TBallMoveReport } from '@/types/TBallMoveReport';
import { canvas } from '@/classes/Canvas';
import { ball } from '@/classes/Ball';
import { paddle } from '@/classes/Paddle';
import { painter } from '@/classes/Painter';

export default Vue.extend({
  name: 'App',

  data() {
    return {
      animRequestId: 0,
      resizeTimeoutId: 0,

      /* for development */
      paddle: paddle.state,
      ball: ball.state,
    };
  },

  computed: {
    styles(): TCanvasStyles {
      return canvas.styles;
    },
  },

  mounted() {
    this.initApp();

    window.addEventListener('resize', this.onResize);
  },

  methods: {
    async initApp() {
      window.cancelAnimationFrame(this.animRequestId);

      await canvas.init();

      ball.init(canvas.width, canvas.height);
      paddle.init(canvas.width, canvas.height);
      painter.init(canvas.context);

      this.drawAll();
    },

    async drawAll() {
      canvas.clear();
      paddle.draw();

      ball
        .move(paddle.x, paddle.endX, paddle.height)
        .then(this.onBallMove)
        .catch(this.onBallMissThePaddle);
    },

    restartTheGame() {
      ball.setInitialCoords();
      ball.setInitialSpeed(canvas.width, canvas.height);
      ball.draw();

      this.animRequestId = window.requestAnimationFrame(this.drawAll);
    },

    async onResize() {
      window.clearTimeout(this.resizeTimeoutId);

      this.resizeTimeoutId = setTimeout(this.initApp, 300);
    },

    onBallMove(moveReport: TBallMoveReport) {
      if (moveReport.bounceFrom === 'paddle') {
        paddle.blinkWithColor('green');
      }

      ball.draw();
      this.animRequestId = window.requestAnimationFrame(this.drawAll);
    },

    onBallMissThePaddle() {
      paddle.blinkWithColor('crimson', 500);

      setTimeout(this.restartTheGame, 1000);
    },

    onMouseMove(e: MouseEvent) {
      /* mouse position relative to canvas element */
      const target = e.target! as HTMLElement;
      const rect = target.getBoundingClientRect();
      const touchX = e.clientX - rect.left;

      paddle.move(touchX - paddle.width / 2);
    },

    onTouchMove(e: TouchEvent) {
      if (!this.isTouchShouldBeHandled(e)) {
        return;
      }

      const touchX = e.touches[0].clientX;

      paddle.move(touchX - paddle.width / 2);
    },

    isTouchShouldBeHandled(e: TouchEvent) {
      const minAvailableX = paddle.x;
      const maxAvailableX = paddle.x + paddle.width;
      const touchX = e.touches[0].clientX;

      if (touchX < minAvailableX || touchX > maxAvailableX) {
        return false;
      }

      return true;
    },

    toggleFullscreen() {
      return document.fullscreenElement
        ? document.exitFullscreen()
        : canvas.el.requestFullscreen();
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
