import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";
import { LAYERS } from "../gameState/collisionLayers";

export const createDemoCubeView = () => {
    const animatedView = createAnimatedView({
        id: 'demoCube',
        layer: LAYERS.DEFAULT,
        shapeProps: {
          width: 10,
          height: 10,
        },
        shape: 'rect',
        fill: {
          color: 'red',
        },
      });
    const screenSaverAnimate = screenSaver(animatedView);

    animatedView.addAnimation(() => {
        screenSaverAnimate();
    }, 'update');

    return animatedView;
};