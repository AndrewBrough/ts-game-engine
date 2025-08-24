export const CANVAS_ID = 'gameCanvas';
export let CANVAS: HTMLCanvasElement;
export let CTX: CanvasRenderingContext2D;

export const createCanvas = (rootId: string) => {
  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const rootNode = document.getElementById(rootId);
  if (rootNode) {
    rootNode.appendChild(canvas);
  } else {
    throw new Error('Root node not found');
  }

  const bindEvents = () => {
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };

  bindEvents();

  CANVAS = canvas;
  CTX = canvas.getContext('2d') as CanvasRenderingContext2D;

  return canvas;
};

export const getCanvas = () => {
  if (!CANVAS) {
    throw new Error('Canvas not found');
  }
  return CANVAS;
};

export const getContext = () => {
  if (!CTX) {
    throw new Error('Context not found');
  }
  return CTX;
};
