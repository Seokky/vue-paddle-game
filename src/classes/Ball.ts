import Vue from 'vue';
import { TBallState } from '@/types/TBallState';
import { TCoordsLimits } from '@/types/TCoordsLimits';
import { TBallCoordinates } from '@/types/TBallCoordinates';
import { TCoords } from '@/types/TCoords';
import { TBallMoveReport } from '@/types/TBallMoveReport';
import {
  MIN_BALL_RADIUS, BALL_COLOR, BALL_SHADOW_COLOR, INITIAL_BALL_X, INITIAL_BALL_Y,
} from '@/constants';
import { getFixedNumberValue } from '@/utils';
import { painter } from '@/classes/Painter';

class Ball {
  #state: TBallState = Vue.observable({
    x: 0,
    y: 0,
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
    shadowColor: BALL_SHADOW_COLOR,
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

  get shadowColor() {
    return this.#state.shadowColor;
  }

  public init(canvasWidth: number, canvasHeight: number) {
    this.setCoordsLimits(canvasWidth, canvasHeight);
    this.setInitialRadius(canvasWidth);
    this.setInitialSpeed(canvasWidth, canvasHeight);
    this.setInitialCoords();
  }

  public move(
    paddleStart: number,
    paddleEnd: number,
    paddleHeight: number,
  ): Promise<TBallMoveReport> {
    this.setCoordinates({
      x: this.x + this.speed.x,
      y: this.y + this.speed.y,
    });

    const { max, min } = this.#state.coordsLimits;

    return new Promise((resolve, reject) => {
      if (this.x >= max.x) {
        this.setCoordinates({ x: max.x });
        this.reverseSpeed('x');

        return resolve({
          bounce: true,
          bounceFrom: 'wall',
        });
      }

      if (this.x <= min.x) {
        this.setCoordinates({ x: min.x });
        this.reverseSpeed('x');

        return resolve({
          bounce: true,
          bounceFrom: 'wall',
        });
      }

      /* if the ball missed the paddle */
      if (this.y >= max.y) {
        return reject();
      }

      if (this.y <= min.y) {
        this.setCoordinates({ y: min.y });
        this.reverseSpeed('y');

        return resolve({
          bounce: true,
          bounceFrom: 'wall',
        });
      }

      /* if the ball hit the paddle */
      const maxYWithPaddle = max.y - paddleHeight;
      const didBallHitPaddle = (this.y > maxYWithPaddle)
                            && (this.x >= paddleStart)
                            && (this.x <= paddleEnd);

      if (didBallHitPaddle) {
        this.setCoordinates({ y: maxYWithPaddle });
        this.reverseSpeed('y');

        return resolve({
          bounce: true,
          bounceFrom: 'paddle',
        });
      }

      return resolve({ bounce: false });
    });
  }

  public draw() {
    painter.setShadow(0, 0, 5, this.shadowColor);
    painter.fillCircle(
      this.x,
      this.y,
      this.radius,
      this.color,
    );
  }

  public setSpeed(value: number, axis?: 'x' | 'y') {
    if (axis) {
      this.#state.speed[axis] = value;
    }

    this.#state.speed.x = value;
    this.#state.speed.y = value;
  }

  public setCoordinates(payload: TBallCoordinates) {
    this.#state.x = payload.x
      ? getFixedNumberValue(payload.x)
      : this.#state.x;

    this.#state.y = payload.y
      ? getFixedNumberValue(payload.y)
      : this.#state.y;
  }

  public setInitialCoords() {
    this.setCoordinates({
      x: INITIAL_BALL_X,
      y: INITIAL_BALL_Y,
    });
  }

  public setInitialSpeed(canvasWidth: number, canvasHeight: number) {
    const speedX = (canvasWidth / 100) * 0.5;
    const speedY = (canvasHeight / 100) * 0.65;

    this.setSpeed(speedX, 'x');
    this.setSpeed(speedY, 'y');
  }

  private setInitialRadius(canvasWidth: number) {
    const proportionalRadius = (canvasWidth / 100) * 1.1;

    this.#state.radius = Math.max(
      MIN_BALL_RADIUS,
      proportionalRadius,
    );
  }

  private setCoordsLimits(canvasWidth: number, canvasHeight: number) {
    this.#state.coordsLimits.min.x = this.radius;
    this.#state.coordsLimits.min.y = this.radius;
    this.#state.coordsLimits.max.x = canvasWidth - this.radius;
    this.#state.coordsLimits.max.y = canvasHeight - this.radius;
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
