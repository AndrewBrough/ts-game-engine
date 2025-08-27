import { createGame } from '../core/game/game';
import { keyboardShortcuts } from '../core/input/keyboardShortcuts';
import { getSceneManager } from '../core/scene/sceneManager';
import { breakTheGameScene } from './scenes/breakTheGameScene';
import { demoScene } from './scenes/playerEnemyScene';
import { pong } from './scenes/pongScene';

export const demoGame = () => {
  createGame();

  getSceneManager().addScene('TEST', demoScene);
  getSceneManager().addScene('BREAK_THE_ENGINE', breakTheGameScene);
  getSceneManager().addScene('PONG', pong);

  const shortcuts = keyboardShortcuts();

  shortcuts.addShortcut('1', () => {
    getSceneManager().loadScene('TEST');
  });
  shortcuts.addShortcut('2', () => {
    getSceneManager().loadScene('BREAK_THE_ENGINE');
  });
  shortcuts.addShortcut('3', () => {
    getSceneManager().loadScene('PONG');
  });
};

export default demoGame;
