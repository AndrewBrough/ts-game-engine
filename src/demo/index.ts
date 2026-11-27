import { createGame, destroyGame } from '../core/game/game';
import { keyboardShortcuts } from '../core/input/keyboardShortcuts';
import { getSceneManager } from '../core/scene/sceneManager';
import { breakTheGameScene } from './scenes/breakTheGameScene';
import { demoScene } from './scenes/playerEnemyScene';
import { pong } from './scenes/pongScene';

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
  shortcuts.addShortcut('2', () => {
    createGame();
    getSceneManager().loadSceneByFunction(breakTheGameScene); // example of just loading a scene directly from it's function
  });
  shortcuts.addShortcut('3', () => {
    createGame();
    getSceneManager().loadSceneByFunction(pong);
  });
  shortcuts.addShortcut('0', () => {
    destroyGame();
  });
};

export default demoGame;
