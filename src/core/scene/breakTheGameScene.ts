import { createEnemyView } from '../view/createEnemyView';
import { createScene, type SceneInstance } from './scene';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  for (let i = 0; i < 500; i++) {
    createEnemyView(`demoCube-${i}`);
  }

  return scene;
};
