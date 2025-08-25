import { createEvents, type EventInstance } from '../events/events';
import {
  collisionManager,
  type CollisionManager,
} from '../gameState/collisionManager';
import { clearAllViews, getState } from '../gameState/gameState';
import { createFpsView } from '../loop/fpsView';
import { createEnemyView } from '../view/demoCubeView';
import { createPauseButton } from '../view/pauseButton';
import { createPlayerView } from '../view/player/playerView';
import type { View } from '../view/types';
import { createWorldBoundsView } from '../view/world/worldBoundsView';

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

  // createWorldBoundsView();
  createPlayerView();
  createEnemyView();

  // createFpsView();
  // createPauseButton();

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
