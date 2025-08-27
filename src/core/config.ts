import type { View } from './view/types';
import { Screen } from './units';

export const defaultViewConfig: View = {
  id: crypto.randomUUID(),
  model: {
    maxHealth: 100,
    health: 100,
    speed: 1,
    maxSpeed: 10,
    collisionDamage: 0,
  },
  scale: 1,
  layer: 'DEFAULT',
  text: {
    text: '',
    fontSize: Screen.percent(5).w,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
    offset: 'center',
    style: {
      fill: {
        color: 'white',
        opacity: 1,
      },
      stroke: {
        color: 'white',
        width: 1,
        opacity: 0,
      },
    },
  },
  geometry: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    shape: undefined,
    style: {
      fill: {
        color: 'black',
        opacity: 1,
      },
      stroke: {
        color: 'white',
        width: 1,
        opacity: 1,
      },
      radii: 0,
    },
  },
  physics: {
    speed: 1, // how fast the view moves
    currentForce: { x: 0, y: 0 }, // how much force is applied to the view
    dampening: 0.9, // how much current force is reduced after every physics update (drag)
    bounce: 2, // how much force is applied to current force when colliding with another view
  },
  components: {},
};
