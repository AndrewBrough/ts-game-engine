import { destroyGame } from '../game/game';
import { type SceneInstance } from './scene';

export type SceneManager = ReturnType<typeof createSceneManager>;

const createSceneManager = () => {
  const scenes: Record<string, () => SceneInstance> = {};
  const loadedScenes: Record<string, SceneInstance> = {};

  const addScene = (sceneName: string, scene: () => SceneInstance) => {
    scenes[sceneName] = scene;
  };

  const loadScene = (sceneName: string) => {
    if (Object.keys(loadedScenes).length > 0) {
      unloadScene();
      destroyGame();
    }
    const scene = scenes[sceneName];
    const sceneInstance = scene();
    loadedScenes[sceneInstance.name] = sceneInstance;
    return sceneInstance;
  };

  const unloadScene = (sceneName?: string) => {
    const sceneToUnload = sceneName ?? Object.keys(loadedScenes)[0];
    if (!sceneToUnload) {
      return;
    }
    loadedScenes[sceneToUnload]?.destroy();
    delete loadedScenes[sceneToUnload];
  };

  const unloadAllScenes = () => {
    for (const sceneName in loadedScenes) {
      unloadScene(sceneName);
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
