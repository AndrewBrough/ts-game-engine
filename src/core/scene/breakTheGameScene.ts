import { createDemoCubeView } from '../view/demoCubeView';
import { createPlayerView } from '../view/player/playerView';
import { createScene, type SceneInstance } from './scene';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  for (let i = 0; i < 5; i++) {
    createDemoCubeView(`demoCube-${i}`);
  }

  createPlayerView();

  return scene;
};
