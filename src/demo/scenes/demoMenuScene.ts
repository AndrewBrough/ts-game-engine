import { createButton, type ButtonProps } from '../../core/components/button';
import { createScene, type SceneInstance } from '../../core/scene/scene';
import { getSceneManager } from '../../core/scene/sceneManager';
import { Screen } from '../../core/units';
import { breakTheGameScene } from './breakTheGameScene';
import { demoScene } from './playerEnemyScene';
import { pongScene } from './pongScene';

/**
 * Lays buttons out in a vertical column, centred on screen.
 * Returns the layout for the button at `index` of `count`. Reads Screen
 * each call, so it stays centred when re-run on resize.
 */
const stackedCentered = (index: number, count: number) => {
  const width = Screen.percent(20).w;
  const height = Screen.percent(8).h;
  const gap = Screen.percent(2).h;
  const totalHeight = count * height + (count - 1) * gap;
  const top = Screen.center.y - totalHeight / 2;
  return {
    width,
    height,
    x: Screen.center.x - width / 2,
    y: top + index * (height + gap),
    fontSize: Screen.percent(2).w,
  };
};

export const demoMenuScene = () => {
  const scene = createScene('demoMenuScene');

  const buttons: ButtonProps[] = [
    { onClick: () => clearAndLoadScene(demoScene), text: { text: 'Game 1' } },
    {
      onClick: () => clearAndLoadScene(breakTheGameScene),
      text: { text: 'Game 2' },
    },
    { onClick: () => clearAndLoadScene(pongScene), text: { text: 'Game 3' } },
  ];

  const clearAndLoadScene = (sceneFn: () => SceneInstance) => {
    const sceneManager = getSceneManager();
    sceneManager.unloadAllScenes();
    sceneManager.loadSceneByFunction(sceneFn);
  };

  const [game1Btn, game2Btn, game3Btn] = buttons.map((props, i) =>
    createButton({
      ...props,
      layout: () => stackedCentered(i, buttons.length),
    })
  );

  return scene;
};
