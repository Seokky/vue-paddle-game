import { TCoordsLimits } from './TCoordsLimits';

export type TBallState = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  radius: number;
  coordsLimits: TCoordsLimits;
  color: string;
}
