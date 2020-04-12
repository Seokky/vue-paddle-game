import { TCoordsLimits } from './TCoordsLimits';
import { TCoords } from './TCoords';

export type TBallState = {
  x: number;
  y: number;
  speed: TCoords;
  radius: number;
  coordsLimits: TCoordsLimits;
  color: string;
}
