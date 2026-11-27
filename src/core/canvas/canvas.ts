export const CANVAS_ID = 'gameCanvas';
export let CANVAS: HTMLCanvasElement;
export let CTX: CanvasRenderingContext2D;

/**
 * Cap on backing-store pixels per CSS pixel. 2 keeps Retina displays sharp;
 * 3x phones would otherwise fill 2.25x as many pixels per frame for little
 * visible gain.
 */
const MAX_PIXEL_RATIO = 2;

let resizeObserver: ResizeObserver | null = null;

/** Fired on window after the canvas changes size. Sizes are CSS pixels. */
export const CANVAS_RESIZE = 'canvasResize';
export type CanvasResizeDetail = { width: number; height: number };

/**
 * Match the canvas backing store to its on-screen size × pixel ratio.
 * Drawing code keeps using CSS pixels (same units as Screen and mouse
 * clientX/Y) because the context is scaled to match.
 */
const syncCanvasSize = (
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number
) => {
  const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const width = Math.round(cssWidth * ratio);
  const height = Math.round(cssHeight * ratio);

  // Assigning width/height reallocates and clears the canvas, so skip no-ops
  if (canvas.width === width && canvas.height === height) return;

  canvas.width = width;
  canvas.height = height;
  // Resizing resets context state, including the transform
  canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);

  window.dispatchEvent(
    new CustomEvent<CanvasResizeDetail>(CANVAS_RESIZE, {
      detail: { width: cssWidth, height: cssHeight },
    })
  );
};

export const createCanvas = (rootId: string) => {
  const rootNode = document.getElementById(rootId);
  if (!rootNode) {
    throw new Error('Root node not found');
  }

  const canvas = document.createElement('canvas');
  canvas.id = CANVAS_ID;
  rootNode.appendChild(canvas);

  CANVAS = canvas;
  CTX = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Size now so the first frame isn't drawn on the default 300×150 canvas
  syncCanvasSize(
    canvas,
    canvas.clientWidth || window.innerWidth,
    canvas.clientHeight || window.innerHeight
  );

  // Fires at most once per frame, before paint, for window resizes, device
  // rotation and mobile browser bars showing/hiding. Cheaper than 'resize',
  // which can fire many times per frame while a window is dragged.
  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(([entry]) => {
    const { inlineSize, blockSize } = entry.contentBoxSize[0];
    syncCanvasSize(canvas, inlineSize, blockSize);
  });
  resizeObserver.observe(canvas);

  return canvas;
};

export const destroyCanvas = () => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  document.getElementById(CANVAS_ID)?.remove();
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
