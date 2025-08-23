import { createDemoCubeView } from "../view/demoCubeView";
import { createPlayerView } from "../view/player/playerView";
import { createScene, type SceneInstance } from "./scene";

export const breakTheGameScene = (): SceneInstance => {
    const scene = createScene('breakTheGame');

    scene.start = () => {
        scene.init();
        for(let i = 0; i < 10; i++) {
            createDemoCubeView();
        }
        createPlayerView();
    }

    return scene;
}