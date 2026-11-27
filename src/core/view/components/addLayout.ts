import { CANVAS_RESIZE } from '../../canvas/canvas';
import type { ViewInstance } from '../view';

export type Layout = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fontSize?: number;
};

/** Reads Screen (or anything else) and returns where the view should be. */
export type LayoutFn = () => Layout;

export type LayoutComponent = ReturnType<typeof addLayout>;

/**
 * Keeps a view positioned relative to the screen. `layout` runs now and again
 * every time the canvas resizes (window resize, device rotation).
 *
 * view.addComponent('layout', addLayout(view, () => ({
 *   x: Screen.w - Screen.percent(5).w,
 *   y: Screen.percent(1).w,
 * })));
 */
export const addLayout = (view: ViewInstance, layout: LayoutFn) => {
  const apply = () => {
    const { fontSize, ...geometry } = layout();
    Object.assign(view.geometry, geometry);
    if (fontSize !== undefined) view.updateFontSize(fontSize);
  };

  apply();
  // view.events listeners are removed when the view/scene is destroyed
  view.events.addEvent(CANVAS_RESIZE, apply);

  return { apply };
};
