import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";
import { LAYERS } from "../gameState/collisionLayers";

export const createDemoCubeView = () => {
    // Generate random positions between 0-100
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    
    const animatedView = createAnimatedView({
        id: 'demoCube',
        layer: LAYERS.DEFAULT,
        position: {
            x: randomX,
            y: randomY,
        },
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