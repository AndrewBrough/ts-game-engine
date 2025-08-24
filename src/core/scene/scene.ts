import { createEvents, type EventInstance } from '../events/events';
import {
  collisionManager,
  type CollisionManager,
} from '../gameState/collisionManager';
import { clearAllViews, getState } from '../gameState/gameState';
import { createPlayerView } from '../view/player/playerView';
import type { View } from '../view/types';

export type Scene = {
  name: string;
  views: View[];
  events: EventInstance;
  collisions: CollisionManager;
};

export type SceneInstance = ReturnType<typeof createScene>;

export const createScene = (name: string = 'default') => {
  console.log('Creating scene', name);
  const state = getState();
  const events = createEvents();
  const collisions = collisionManager();

  createPlayerView();

  const destroy = () => {
    console.log('Destroying scene', name);
    events.cleanup();
    collisions.events.cleanup();
    clearAllViews();
    console.log('Cleared all views', getState().views);
  };

  return {
    name,
    state,
    events,
    collisions,
    destroy,
  };
};
