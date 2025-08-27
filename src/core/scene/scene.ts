import { createEvents, type EventInstance } from '../events/events';
import {
  collisionManager,
  type CollisionManager,
} from '../gameState/collisionManager';
import { clearAllViews, getState } from '../gameState/gameState';
import { createFpsView } from '../loop/fpsView';
import { createPauseButton } from '../view/pauseButton';
import type { View } from '../view/types';

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

  createFpsView();
  createPauseButton();

  const destroy = () => {
    // Clean up scene-specific events
    events.cleanup();
    collisions.events.cleanup();

    // Clear all views and their resources
    clearAllViews();

    // Reset game state to initial values
    state.score = 0;
    state.isLogicPaused = false;
    state.timeScale = 1;
  };

  return {
    name,
    state,
    events,
    collisions,
    destroy,
  };
};
