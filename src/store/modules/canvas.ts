import { Module } from 'vuex';
import { RootState } from '@/types/RootState';
import { CanvasState } from '@/types/CanvasState';
import { TCanvasStyles } from '@/types/TCanvasStyles';
import { TCanvasMutationPayload } from '@/types/TCanvasMutationPayload';
import { LANDSCAPE_MAX_WIDTH, PORTRAIT_MAX_WIDTH } from '@/constants';

function getHeightDependsOnMode(rootGetters, width: number) {
  return rootGetters.orientation === 'landscape'
    ? width / 1.5
    : width * 1.3;
}

const moduleCanvas: Module<CanvasState, RootState> = {
  namespaced: true,

  state: {
    el: null,
    ctx: null,
    width: 0,
    height: 0,
  },

  getters: {
    el(state): HTMLCanvasElement {
      return state.el! || { styles: {} };
    },
    context(state): CanvasRenderingContext2D {
      return state.ctx!;
    },
    width(state) {
      return state.width;
    },
    height(state) {
      return state.height;
    },
    styles(state, getters): TCanvasStyles {
      return {
        width: `${getters.width}px`,
        height: `${getters.height}px`,
      };
    },
  },

  actions: {
    async init({ dispatch }) {
      await dispatch('setContext');
      await dispatch('setSizes');
    },
    setContext({ commit }) {
      const el = document.getElementById('canvas') as HTMLCanvasElement;

      commit('mutate', {
        property: 'el',
        with: el,
      });
      commit('mutate', {
        property: 'ctx',
        with: el.getContext('2d'),
      });
    },
    async setSizes({ rootGetters, dispatch, commit }) {
      const maxWidth = rootGetters.orientation === 'landscape'
        ? LANDSCAPE_MAX_WIDTH
        : PORTRAIT_MAX_WIDTH;
      const minWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      let width = Math.min(minWidth, maxWidth);
      let height = getHeightDependsOnMode(rootGetters, width);

      /*
        decreasing the width until we can
        calculate height that meet ratio
      */
      while (height > maxHeight) {
        width -= 5;
        height = getHeightDependsOnMode(rootGetters, width);
      }

      /* pure values we can use */
      commit('mutate', { property: 'width', with: width });
      commit('mutate', { property: 'height', with: height });

      /* canvas element attributes */
      commit('mutateCanvasEl', { property: 'width', with: width });
      commit('mutateCanvasEl', { property: 'height', with: height });
    },
  },

  mutations: {
    mutate(state, payload: TCanvasMutationPayload) {
      state[payload.property] = payload.with;
    },
    mutateCanvasEl(state, payload: {
      property: 'width' | 'height'; with: number;
    }) {
      state.el[payload.property] = payload.with;
    },
  },
};

export { moduleCanvas };
