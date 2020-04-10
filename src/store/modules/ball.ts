import { Module } from 'vuex';
import { RootState } from '@/types/RootState';
import { BallState } from '@/types/BallState';

const moduleBall: Module<BallState, RootState> = {
  namespaced: true,

  state: {
    x: 35,
    y: 35,
    speedX: 5,
    speedY: 5,
  },

  getters: {
    ballGetter(state, getters, rootState) {
      // const proportionalRadius = (canvas.width / 100) * 2;

      return rootState.modulePaddle;
    },
  },
};

export { moduleBall };
