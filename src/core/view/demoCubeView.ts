import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";

export const createDemoCubeView = () => {
    // Generate random positions between 0-100
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    
    const animatedView = createAnimatedView({
        id: 'demoCube',
        layer: 'DEFAULT',
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

// Function to create multiple demo cubes for performance testing
export const createMultipleDemoCubes = (count: number) => {
    const cubes = [];
    for (let i = 0; i < count; i++) {
        const cube = createAnimatedView({
            id: `demoCube${i}`,
            layer: 'DEFAULT',
            position: {
                x: Math.random() * 100,
                y: Math.random() * 100,
            },
            shapeProps: {
                width: 10,
                height: 10,
            },
            shape: 'rect',
            fill: {
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            },
        });
        
        const screenSaverAnimate = screenSaver(cube);
        cube.addAnimation(() => {
            screenSaverAnimate();
        }, 'update');
        
        cubes.push(cube);
    }
    return cubes;
};