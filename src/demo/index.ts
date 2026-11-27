import { createGame, destroyGame } from '../core/game/game';
import { keyboardShortcuts } from '../core/input/keyboardShortcuts';
import type { SceneInstance } from '../core/scene/scene';
import { getSceneManager } from '../core/scene/sceneManager';
import { breakTheGameScene } from './scenes/breakTheGameScene';
import { demoMenuScene } from './scenes/demoMenuScene';
import { demoScene } from './scenes/playerEnemyScene';
import { pongScene } from './scenes/pongScene';

/**
 * Use shortcuts 1,2,3 or 0 to start a demo or clear it off the screen.
 */
export const demoGame = () => {
  getSceneManager().addScene('DEMO', demoScene); // example method of referencing a scene
  const shortcuts = keyboardShortcuts();

  shortcuts.addShortcut('1', () => {
    createGame(); // cleans up previous games, sets up new game
    getSceneManager().loadScene('DEMO');
  });
  shortcuts.addShortcut('2', () => loadScene(breakTheGameScene));
  shortcuts.addShortcut('3', () => loadScene(pongScene));
  shortcuts.addShortcut('9', () => loadScene(demoMenuScene));
  shortcuts.addShortcut('0', () => {
    destroyGame();
  });

  const loadScene = (scene: () => SceneInstance) => {
    createGame();
    getSceneManager().loadSceneByFunction(scene); // alternate way to load a scene without adding it first
  }

  loadScene(demoMenuScene);
};

export default demoGame;
