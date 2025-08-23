import { breakTheGameScene } from "./breakTheGameScene";
import { createScene, type SceneInstance } from "./scene";

export type SceneManager = ReturnType<typeof createSceneManager>;

const SCENES = {
    TEST: createScene,
    BREAK_THE_ENGINE: breakTheGameScene,
}

export type SceneName = keyof typeof SCENES;

const createSceneManager = () => {
    const scenes: Set<SceneInstance> = new Set();

    const loadScene = (sceneName: SceneName) => {
        const scene = SCENES[sceneName];
        
        // Unload all scenes before loading a new one for now
        for(const scene of scenes) {
            console.log('Unloading scene', scene.name);
            unloadScene(scene.name);
        }

        const sceneInstance = scene();
        console.log('Loaded scene', sceneInstance);
        scenes.add(sceneInstance);
        return sceneInstance;
    }

    const unloadScene = (sceneName: string) => {
        for(const scene of scenes) {
            if(scene.name === sceneName) {
                scene.destroy();
                scenes.delete(scene);
            }
        }
    }

    return {
        loadScene,
        unloadScene,
    }
}

/* This is a singleton and should only be made/initialized once */
const sceneManager = createSceneManager();
export const getSceneManager = () => sceneManager;