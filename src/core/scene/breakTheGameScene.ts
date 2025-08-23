import { createDemoCubeView } from "../view/demoCubeView";
import { createPlayerView } from "../view/player/playerView";

export const breakTheGameScene = () => {
    const start = () => {
        for(let i = 0; i < 50; i++) {
            createDemoCubeView();
        }
        createPlayerView();
    }

    return {start};
}