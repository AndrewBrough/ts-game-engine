import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import { deepMerge } from '../../utils/deepMerge';
import type { View } from '../types';
import { createView, type ViewInstance } from '../view';
import { addPhysics } from '../components/addPhysics';
import { addAnimations, addCollisions } from '../components';
import { addWallBounce, addCollisionBounce } from '../components/movement';
import { addCollisionDamage } from '../components/events/addCollisionDamage';

export type EntityViewInstance = ViewInstance & {
  physics: ReturnType<typeof addPhysics>;
  collisions: ReturnType<typeof addCollisions>;
};

const defaultViewProps: DeepPartial<View> = {
  model: {
    speed: 10,
    maxHealth: 100,
    health: 100,
    collisionDamage: 10,
  },
  geometry: {
    shape: 'rect',
    width: Math.min(Screen.percent(7.5).w, 50),
    height: Math.min(Screen.percent(7.5).w, 50),
  },
};

export const createEntityView = (props: DeepPartial<View>) => {
  const mergedProps = deepMerge(defaultViewProps, props);
  const view = createView({
    ...mergedProps,
  });

  view.addComponent('animations', addAnimations(view));
  view.addComponent('physics', addPhysics(view));
  view.addComponent('collisions', addCollisions(view));
  view.addComponent('wallBounce', addWallBounce(view));
  view.addComponent('collisionBounce', addCollisionBounce(view));
  view.addComponent('collisionDamage', addCollisionDamage(view));

  return view;
};
