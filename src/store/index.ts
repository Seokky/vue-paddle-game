import Vue from 'vue';
import Vuex from 'vuex';
import { TMode } from '@/types/TMode';
import { moduleCanvas } from './modules/canvas';
import { moduleBall } from './modules/ball';
import { modulePaddle } from './modules/paddle';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    moduleCanvas,
    moduleBall,
    modulePaddle,
  },

  state: {
    canvas: null,
  },

  getters: {
    orientation(): TMode {
      return window.innerWidth > window.innerHeight
        ? 'landscape'
        : 'portrait';
    },
  },

  mutations: {
  },

  actions: {
  },
});
