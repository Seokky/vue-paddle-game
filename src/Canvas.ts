import Vue from 'vue';

type TCanvasSizes = {
  width: number;
  height: number;
}

type TCanvasStyles = {
  width: string;
  height: string;
}

class Canvas {
  private state = Vue.observable({
    el: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,
    width: 0 as number,
    height: 0 as number,
  });

  get el(): HTMLCanvasElement {
    return this.state.el! || { styles: {} };
  }

  get context(): CanvasRenderingContext2D {
    return this.state.ctx!;
  }

  get sizes(): TCanvasSizes {
    return {
      width: this.state.width,
      height: this.state.height,
    };
  }

  get styles(): TCanvasStyles {
    return {
      width: `${this.sizes.width}px`,
      height: `${this.sizes.height}px`,
    };
  }

  public async init() {
    this.setContext();
    await this.setSizes();

    return Promise.resolve();
  }

  private setContext() {
    const el = document.getElementById('canvas') as HTMLCanvasElement;

    this.state.el = el;
    this.state.ctx = el.getContext('2d');
  }

  private setSizes() {
    return new Promise((resolve) => {
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = window.innerHeight;

      let width = Math.min(window.innerWidth, MAX_WIDTH);
      let height = width / 2;

      /*
        decreasing the width until we can
        calculate height that meet ratio
      */
      while (height > MAX_HEIGHT) {
        width -= 5;
        height = width / 2;
      }

      /* pure values we can use */
      this.state.width = width;
      this.state.height = height;

      /* canvas element attributes */
      this.state.el!.width = width;
      this.state.el!.height = height;

      resolve();
    });
  }
}

const canvas = new Canvas();

export { canvas };
