import { createPauseButton } from '../../demo/views/pauseButton';
import type { ButtonProps } from '../components/button';
import { createEvents, type EventInstance } from '../events/events';
import {
  collisionManager,
  type CollisionManager,
} from '../gameState/collisionManager';
import { clearAllViews, getState } from '../gameState/gameState';
import { createFpsView } from '../loop/fpsView';
import type { View } from '../view/types';

export type Scene = {
  name: string;
  views: View[];
  events: EventInstance;
  collisions: CollisionManager;
};

export type SceneInstance = ReturnType<typeof createScene>;

export type SceneOptions = {
  /** Overrides for the built-in pause button, e.g. different hotkeys. */
  pauseButton?: ButtonProps;
};

export const createScene = (
  name: string = 'default',
  { pauseButton }: SceneOptions = {}
) => {
  const state = getState();
  const events = createEvents();
  const collisions = collisionManager();

  createFpsView();
  createPauseButton(pauseButton);

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
