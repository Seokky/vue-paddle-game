import Vue from 'vue';
import { TBallState } from '@/types/TBallState';
import { TCoordsLimits } from '@/types/TCoordsLimits';
import { TBallCoordinates } from '@/types/TBallCoordinates';
import { MIN_BALL_RADIUS, BALL_COLOR } from '@/constants';

class Ball {
  #state: TBallState = Vue.observable({
    x: 35,
    y: 35,
    speedX: 5,
    speedY: 5,
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

  get x() {
    return this.#state.x;
  }

  get y() {
    return this.#state.y;
  }

  get speedX() {
    return this.#state.speedX;
  }

  get speedY() {
    return this.#state.speedY;
  }

  get radius() {
    return this.#state.radius;
  }

  get color() {
    return this.#state.color;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    this.setCoordsLimits(canvasWidth, canvasHeight);
    this.setRadius(canvasWidth);
  }

  public move() {
    this.setCoordinates({
      x: this.x + this.speedX,
      y: this.y + this.speedY,
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

  private setCoordsLimits(canvasWidth: number, canvasHeight: number) {
    this.#state.coordsLimits.min.x = this.radius;
    this.#state.coordsLimits.min.y = this.radius;
    this.#state.coordsLimits.max.x = canvasWidth - this.radius;
    this.#state.coordsLimits.max.y = canvasHeight - this.radius;
  }

  private setRadius(canvasWidth: number) {
    const proportionalRadius = (canvasWidth / 100) * 2;

    this.#state.radius = Math.min(
      MIN_BALL_RADIUS,
      proportionalRadius,
    );
  }

  private setCoordinates(payload: TBallCoordinates) {
    function getNormalizedValue(val: number) {
      return Number(val.toFixed(2));
    }

    this.#state.x = payload.x
      ? getNormalizedValue(payload.x)
      : this.#state.x;

    this.#state.y = payload.y
      ? getNormalizedValue(payload.y)
      : this.#state.y;
  }

  private reverseSpeed(axis: 'x' | 'y') {
    if (axis === 'x') {
      this.#state.speedX *= -1;
    } else {
      this.#state.speedY *= -1;
    }
  }
}

const ball = new Ball();

export { ball };
