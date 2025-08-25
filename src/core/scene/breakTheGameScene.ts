import { createEnemyView } from '../view/demoCubeView';
import { createScene, type SceneInstance } from './scene';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  for (let i = 0; i < 5; i++) {
    createEnemyView(`demoCube-${i}`);
  }

  return scene;
};
