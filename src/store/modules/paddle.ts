import { Module } from 'vuex';
import { RootState } from '@/types/RootState';
import { BallState } from '@/types/BallState';

const modulePaddle: Module<BallState, RootState> = {
  namespaced: true,

  state: {
    x: 22,
    y: 22,
    speedX: 22,
    speedY: 12,
  },

  // getters: {
  //   ballRadius(state) {
  //     const proportionalRadius = (canvas.width / 100) * 2;

  //     return Math.min(MIN_BALL_RADIUS, proportionalRadius);
  //   },
  // },
};

export { modulePaddle };
