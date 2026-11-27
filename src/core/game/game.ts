import { createCanvas, destroyCanvas } from '../canvas/canvas';
import { cleanupEventListeners } from '../events/events';
import { clearAllViews } from '../gameState/gameState';
import { bindKeyboard } from '../input/keyboard';
import { bindMouse } from '../input/mouse';
import { createLoop } from '../loop/loop';
import { getSceneManager } from '../scene/sceneManager';

let gameLoop: ReturnType<typeof createLoop> | null = null;

export const createGame = () => {
  destroyGame();
  const canvas = createCanvas('app');
  const mouse = bindMouse();
  const keyboard = bindKeyboard();
  const loop = createLoop();

  gameLoop = loop;

  return {
    canvas,
    mouse,
    keyboard,
    loop,
  };
};

export const destroyGame = () => {
  // Stop the game loop
  gameLoop?.stop();
  cleanupEventListeners();
  clearAllViews();
  destroyCanvas();

  const sceneManager = getSceneManager();
  sceneManager.unloadAllScenes();
};
