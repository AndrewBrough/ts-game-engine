import { createEvents, type EventInstance } from '../events/events';
import {
  collisionManager,
  type CollisionManager,
} from '../gameState/collisionManager';
import { clearAllViews, getState } from '../gameState/gameState';
import { createAnimatedView } from '../view/animatedView';
import { createDemoCubeView } from '../view/demoCubeView';
import { createPlayerView } from '../view/player/playerView';
import type { EntityModel, View } from '../view/types';

export type Scene = {
  name: string;
  views: View[];
  events: EventInstance;
  collisions: CollisionManager;
};

export type SceneInstance = ReturnType<typeof createScene>;

export const createScene = (name: string = 'default') => {
  const state = getState();
  const events = createEvents();
  const collisions = collisionManager();

  const playerView = createPlayerView();
  const playerHealthView = createAnimatedView({
    ...playerView,
    anchor: 'top-left',
    position: {
      x: 1,
      y: 1,
    },
    fill: {
      color: 'violet',
      opacity: 1,
    },
    stroke: {
      color: 'transparent',
      opacity: 0,
      width: 0,
    },
    textProps: {
      text: (playerView.model as EntityModel).health.toString() ?? '0',
    },
  });

  createDemoCubeView();

  const destroy = () => {
    events.cleanup();
    collisions.events.cleanup();
    clearAllViews();
  };

  return {
    name,
    state,
    events,
    collisions,
    destroy,
  };
};
