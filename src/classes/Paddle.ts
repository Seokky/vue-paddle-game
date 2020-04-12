import Vue from 'vue';
import { TPaddleState } from '@/types/TPaddleState';
import {
  DEFAULT_PADDLE_WIDTH,
  DEFAULT_PADDLE_HEIGHT,
  MIN_DEFAULT_PADDLE_WIDTH,
  PADDLE_COLOR,
  PADDLE_SHADOW_COLOR,
} from '@/constants';
import { getFixedNumberValue } from '@/utils';
import { painter } from '@/classes/Painter';

class Paddle {
  #state: TPaddleState = Vue.observable({
    width: DEFAULT_PADDLE_WIDTH,
    height: DEFAULT_PADDLE_HEIGHT,
    x: 0,
    y: 0,
    minX: 0,
    maxX: 0,
    color: PADDLE_COLOR,
    shadowColor: PADDLE_SHADOW_COLOR,
  })

  get state() {
    const isProd = process.env.NODE_ENV === 'production';

    return isProd ? null : this.#state;
  }

  get x() {
    return this.#state.x;
  }

  get endX() {
    return this.x + this.width;
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

  get color() {
    return this.#state.color;
  }

  get shadowColor() {
    return this.#state.shadowColor;
  }

  private get minX() {
    return this.#state.minX;
  }

  private get maxX() {
    return this.#state.maxX;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    this.setMinMaxX(canvasWidth);
    this.setInitialWidth(canvasWidth);
    this.setInitialX(canvasWidth);
    this.setY(canvasHeight);
  }

  public move(x: number) {
    if (x < this.minX) {
      this.setX(this.minX);
      return;
    }

    if (x > this.maxX) {
      this.setX(this.maxX);
      return;
    }

    this.setX(x);
  }

  public draw() {
    painter.setShadow(0, 0, 10, this.shadowColor);
    painter.fillRect(
      this.x,
      this.y,
      this.width,
      this.height,
      this.color,
    );
  }

  public blinkWithColor(color: string, duration = 150) {
    this.setColor(color);
    this.draw();
    setTimeout(this.resetColor.bind(this), duration);
  }

  private setColor(color: string) {
    this.#state.color = color;
  }

  private resetColor() {
    this.setColor(PADDLE_COLOR);
    this.draw();
  }

  private setMinMaxX(canvasWidth: number) {
    /* allow paddle to out of canvas by half of itself width */
    this.#state.minX = (this.width / 2) * -1;
    this.#state.maxX = canvasWidth - this.width / 2;
  }

  private setInitialX(canvasWidth: number) {
    const canvasCenterX = canvasWidth / 2;

    this.setX(canvasCenterX - this.width / 2);
  }

  private setInitialWidth(canvasWidth: number) {
    const proportionalWidth = canvasWidth / 10;
    const width = Math.max(
      MIN_DEFAULT_PADDLE_WIDTH,
      proportionalWidth,
    );

    this.#state.width = getFixedNumberValue(width);
  }

  private setX(x: number) {
    this.#state.x = getFixedNumberValue(x);
  }

  private setY(canvasHeight: number) {
    const y = canvasHeight - this.height;

    this.#state.y = getFixedNumberValue(y);
  }
}

const paddle = new Paddle();

export { paddle };
