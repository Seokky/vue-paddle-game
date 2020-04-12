import Vue from 'vue';
import { TBallState } from '@/types/TBallState';
import { TCoordsLimits } from '@/types/TCoordsLimits';
import { TBallCoordinates } from '@/types/TBallCoordinates';
import { TCoords } from '@/types/TCoords';
import { MIN_BALL_RADIUS, BALL_COLOR } from '@/constants';
import { getFixedNumberValue } from '@/utils';

class Ball {
  #state: TBallState = Vue.observable({
    x: 35,
    y: 35,
    speed: {
      x: 5,
      y: 5,
    },
    radius: MIN_BALL_RADIUS,
    coordsLimits: {
      min: {
        x: 0,
        y: 0,
      },
      max: {
        x: 0,
        y: 0,
      },
    } as TCoordsLimits,
    color: BALL_COLOR,
  });

  get state() {
    const isProd = process.env.NODE_ENV === 'production';

    return isProd ? null : this.#state;
  }

  get x() {
    return this.#state.x;
  }

  get y() {
    return this.#state.y;
  }

  get speed(): TCoords {
    return this.#state.speed;
  }

  get radius() {
    return this.#state.radius;
  }

  get color() {
    return this.#state.color;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    this.setCoordsLimits(canvasWidth, canvasHeight);
    this.setInitialRadius(canvasWidth);
    this.setInitialSpeed(canvasWidth, canvasHeight);
  }

  public move() {
    this.setCoordinates({
      x: this.x + this.speed.x,
      y: this.y + this.speed.y,
    });

    const { max, min } = this.#state.coordsLimits;

    if (this.x >= max.x) {
      this.setCoordinates({ x: max.x });
      this.reverseSpeed('x');
    }

    if (this.x <= min.x) {
      this.setCoordinates({ x: min.x });
      this.reverseSpeed('x');
    }

    if (this.y >= max.y) {
      this.setCoordinates({ y: max.y });
      this.reverseSpeed('y');
    }

    if (this.y <= min.y) {
      this.setCoordinates({ y: min.y });
      this.reverseSpeed('y');
    }
  }

  public setSpeed(value: number, axis?: 'x' | 'y') {
    if (axis) {
      this.#state.speed[axis] = value;
    }

    this.#state.speed.x = value;
    this.#state.speed.y = value;
  }

  private setCoordsLimits(canvasWidth: number, canvasHeight: number) {
    this.#state.coordsLimits.min.x = this.radius;
    this.#state.coordsLimits.min.y = this.radius;
    this.#state.coordsLimits.max.x = canvasWidth - this.radius;
    this.#state.coordsLimits.max.y = canvasHeight - this.radius;
  }

  private setInitialRadius(canvasWidth: number) {
    const proportionalRadius = (canvasWidth / 100) * 1.1;

    this.#state.radius = Math.max(
      MIN_BALL_RADIUS,
      proportionalRadius,
    );
  }

  private setInitialSpeed(canvasWidth: number, canvasHeight: number) {
    const speedX = (canvasWidth / 100) * 0.5;
    const speedY = (canvasHeight / 100) * 0.65;

    this.setSpeed(speedX, 'x');
    this.setSpeed(speedY, 'y');
  }

  private setCoordinates(payload: TBallCoordinates) {
    this.#state.x = payload.x
      ? getFixedNumberValue(payload.x)
      : this.#state.x;

    this.#state.y = payload.y
      ? getFixedNumberValue(payload.y)
      : this.#state.y;
  }

  private reverseSpeed(axis: 'x' | 'y') {
    if (axis === 'x') {
      this.#state.speed.x *= -1;
    } else {
      this.#state.speed.y *= -1;
    }
  }
}

const ball = new Ball();

export { ball };
