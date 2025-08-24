import { breakTheGameScene } from './breakTheGameScene';
import { createScene, type SceneInstance } from './scene';

export type SceneManager = ReturnType<typeof createSceneManager>;

const SCENES = {
  TEST: createScene,
  BREAK_THE_ENGINE: breakTheGameScene,
};

export type SceneName = keyof typeof SCENES;

const createSceneManager = () => {
  const scenes: Set<SceneInstance> = new Set();

  const loadScene = (sceneName: SceneName) => {
    const createScene = SCENES[sceneName];
    unloadScene(sceneName);

    const sceneInstance = createScene();
    sceneInstance.init();
    console.log('Loaded scene', sceneInstance);
    scenes.add(sceneInstance);
    return sceneInstance;
  };

  const unloadScene = (sceneName: string) => {
    for (const scene of scenes) {
      if (scene.name === sceneName) {
        console.log('Unloading scene', scene.name);
        scene.destroy();
        scenes.delete(scene);
      }
    }
  };

  const unloadAllScenes = () => {
    for (const scene of scenes) {
      unloadScene(scene.name);
    }
  };

  return {
    loadScene,
    unloadScene,
    unloadAllScenes,
  };
};

/* This is a singleton and should only be made/initialized once */
const sceneManager = createSceneManager();
export const getSceneManager = () => sceneManager;
