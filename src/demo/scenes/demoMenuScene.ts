import { createButton, type ButtonProps } from '../../core/components/button';
import { createScene, type SceneInstance } from '../../core/scene/scene';
import { getSceneManager } from '../../core/scene/sceneManager';
import { Screen } from '../../core/units';
import { breakTheGameScene } from './breakTheGameScene';
import { demoScene } from './playerEnemyScene';
import { pongScene } from './pongScene';

const BUTTON = { width: Screen.percent(20).w, height: Screen.percent(8).h };
const GAP = Screen.percent(2).h;

/**
 * Lays buttons out in a vertical column, centred on screen.
 * Returns the geometry for the button at `index` of `count`.
 */
const stackedCentered = (index: number, count: number) => {
  const totalHeight = count * BUTTON.height + (count - 1) * GAP;
  const top = Screen.center.y - totalHeight / 2;
  return {
    ...BUTTON,
    x: Screen.center.x - BUTTON.width / 2,
    y: top + index * (BUTTON.height + GAP),
  };
};

export const demoMenuScene = () => {
  const scene = createScene('demoMenuScene');

  const buttons: ButtonProps[] = [
    { onClick: () => clearAndLoadScene(demoScene), text: { text: 'Game 1' } },
    { onClick: () => clearAndLoadScene(breakTheGameScene), text: { text: 'Game 2' } },
    { onClick: () => clearAndLoadScene(pongScene), text: { text: 'Game 3' } },
  ];

  const clearAndLoadScene = (sceneFn: () => SceneInstance) => {
    const sceneManager = getSceneManager();
    sceneManager.unloadAllScenes();
    sceneManager.loadSceneByFunction(sceneFn);
  }

  const [game1Btn, game2Btn, game3Btn] = buttons.map((props, i) =>
    createButton({
      ...props,
      geometry: stackedCentered(i, buttons.length),
    })
  );

  return scene;
};
