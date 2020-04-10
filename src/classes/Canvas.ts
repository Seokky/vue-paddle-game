// import Vue from 'vue';
// // import { TMode } from '@/types/TMode';
// import { LANDSCAPE_MAX_WIDTH, PORTRAIT_MAX_WIDTH } from '@/constants';

// type TCanvasStyles = {
//   width: string;
//   height: string;
// }

class Canvas {
  // private state = Vue.observable({
  //   el: null as HTMLCanvasElement | null,
  //   ctx: null as CanvasRenderingContext2D | null,
  //   width: 0 as number,
  //   height: 0 as number,
  // });

  // get el(): HTMLCanvasElement {
  //   return this.state.el! || { styles: {} };
  // }

  // get context(): CanvasRenderingContext2D {
  //   return this.state.ctx!;
  // }

  // get width() {
  //   return this.state.width;
  // }

  // get height() {
  //   return this.state.height;
  // }

  // get styles(): TCanvasStyles {
  //   return {
  //     width: `${this.width}px`,
  //     height: `${this.height}px`,
  //   };
  // }

  // static get orientation(): TMode {
  //   return window.innerWidth > window.innerHeight
  //     ? 'landscape'
  //     : 'portrait';
  // }

  // public async init() {
  //   this.setContext();
  //   await this.setSizes();

  //   return Promise.resolve();
  // }

  // private setContext() {
  //   const el = document.getElementById('canvas') as HTMLCanvasElement;

  //   this.state.el = el;
  //   this.state.ctx = el.getContext('2d');
  // }

  // private static getHeightDependsOnMode(width: number) {
  //   return Canvas.orientation === 'landscape'
  //     ? width / 1.5
  //     : width * 1.3;
  // }

  // private setSizes() {
  //   return new Promise((resolve) => {
  //     const maxWidth = Canvas.orientation === 'landscape'
  //       ? LANDSCAPE_MAX_WIDTH
  //       : PORTRAIT_MAX_WIDTH;
  //     const minWidth = window.innerWidth;
  //     const maxHeight = window.innerHeight;

  //     let width = Math.min(minWidth, maxWidth);
  //     let height = Canvas.getHeightDependsOnMode(width);

  //     /*
  //       decreasing the width until we can
  //       calculate height that meet ratio
  //     */
  //     while (height > maxHeight) {
  //       width -= 5;
  //       height = Canvas.getHeightDependsOnMode(width);
  //     }

  //     /* pure values we can use */
  //     this.state.width = width;
  //     this.state.height = height;

  //     /* canvas element attributes */
  //     this.state.el!.width = width;
  //     this.state.el!.height = height;

  //     resolve();
  //   });
  // }
}

const canvas = new Canvas();

export { canvas };
