import { pong } from '../../demo/scenes/pongScene';
import { createScene, type SceneInstance } from './scene';

export type SceneManager = ReturnType<typeof createSceneManager>;

const createSceneManager = () => {
  const scenes: Record<string, () => SceneInstance> = {};
  const loadedScenes: Set<SceneInstance> = new Set();

  const addScene = (sceneName: string, scene: () => SceneInstance) => {
    scenes[sceneName] = scene;
  };

  const loadScene = (sceneName: string) => {
    const scene = scenes[sceneName];
    unloadScene(sceneName);

    const sceneInstance = scene();
    loadedScenes.add(sceneInstance);
    return sceneInstance;
  };

  const unloadScene = (sceneName: string) => {
    for (const scene of loadedScenes) {
      if (scene.name === sceneName) {
        console.log('unloadScene', scene.name);
        scene.destroy();
      }
    }
  };

  const unloadAllScenes = () => {
    for (const scene of loadedScenes) {
      console.log('unloadAllScene', scene.name);
      unloadScene(scene.name);
    }
  };

  return {
    addScene,
    loadScene,
    unloadScene,
    unloadAllScenes,
  };
};

/* This is a singleton and should only be made/initialized once */
const sceneManager = createSceneManager();
export const getSceneManager = () => sceneManager;
