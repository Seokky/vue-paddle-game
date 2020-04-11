import Vue from 'vue';
import { TPaddleState } from '@/types/TPaddleState';
import { DEFAULT_PADDLE_WIDTH, DEFAULT_PADDLE_HEIGHT } from '@/constants';

class Paddle {
  #state: TPaddleState = Vue.observable({
    width: DEFAULT_PADDLE_WIDTH,
    height: DEFAULT_PADDLE_HEIGHT,
    x: 10,
    y: 0,
    minX: 0,
    maxX: 0,
  })

  get x() {
    return this.#state.x;
  }

  get y() {
    return this.#state.y;
  }

  get width() {
    return this.#state.width;
  }

  get height() {
    return this.#state.height;
  }

  private get minX() {
    return this.#state.minX;
  }

  private get maxX() {
    return this.#state.maxX;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    this.setMinMaxX(canvasWidth);
    this.setY(canvasHeight);
  }

  public move(x: number) {
    if (x < this.minX) {
      this.#state.x = this.minX;
      return;
    }

    if (x > this.maxX) {
      this.#state.x = this.maxX;
      return;
    }

    this.#state.x = x;
  }

  private setMinMaxX(canvasWidth: number) {
    this.#state.minX = (this.width / 2) * -1;
    this.#state.maxX = canvasWidth - this.width / 2;
  }

  private setY(canvasHeight: number) {
    this.#state.y = canvasHeight - this.height;
  }
}

const paddle = new Paddle();

export { paddle };
