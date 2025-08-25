import { getContext } from '../canvas/canvas';
import { defaultViewConfig } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, AnyView, Position } from './types';
import { addView, getViewsOnLayer } from '../gameState/gameState';
import { createEvents } from '../events/events';
import { Screen } from '../units';

export type ViewInstance = ReturnType<typeof createView>;

export const createView = (props: DeepPartial<View> = {}) => {
  const view = deepMerge(defaultViewConfig, props);
  const events = createEvents();

  // Helper function to update the view in state
  const updateViewInState = () => {
    const stateViews = getViewsOnLayer(view?.layer ?? 'DEFAULT');
    const viewIndex = stateViews.findIndex((v: AnyView) => v.id === view.id);
    if (viewIndex !== -1) {
      // Override view in state if it already exists
      stateViews[viewIndex] = view;
    } else {
      addView(view);
    }
  };

  // Function to update the position and trigger a redraw
  const updatePosition = (newPosition: Position) => {
    const { x, y } = newPosition;
    const maxX = Screen.w - view.geometry.width;
    const maxY = Screen.h - view.geometry.height;
    view.geometry.x = Math.max(0, Math.min(maxX, x));
    view.geometry.y = Math.max(0, Math.min(maxY, y));
  };

  // Function to update fill color
  const updateFillColor = (fill: { color?: string; opacity?: number }) => {
    view.fill.color = fill.color ?? view.fill.color;
    view.fill.opacity = fill.opacity ?? view.fill.opacity;
  };

  // Function to update stroke color
  const updateStrokeColor = (stroke: {
    color?: string;
    opacity?: number;
    width?: number;
  }) => {
    view.stroke.color = stroke.color ?? view.stroke.color;
    view.stroke.opacity = stroke.opacity ?? view.stroke.opacity;
    view.stroke.width = stroke.width ?? view.stroke.width;
  };

  // Function to update stroke width
  const updateStrokeWidth = (width: number) => {
    view.stroke.width = width;
  };

  // Function to update shape size
  const updateSize = (width: number, height: number) => {
    view.geometry.width = width;
    view.geometry.height = height;
  };

  // Function to update scale
  const updateScale = (scale: number) => {
    view.scale = scale;
  };

  // Function to update text
  const updateText = (text: string | number) => {
    view.textProps.text = text;
  };

  // Function to update font size
  const updateFontSize = (fontSize: number) => {
    view.textProps.fontSize = fontSize;
  };

  const draw = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    const renderShape = (mode: 'fill' | 'stroke' | 'both' = 'both') => {
      const { x, y, width, height } = view.geometry;

      if (view.geometry.shape === 'rect') {
        if (mode === 'fill' || mode === 'both') {
          ctx.fillRect(x, y, width, height);
        }
        if (mode === 'stroke' || mode === 'both') {
          ctx.strokeRect(x, y, width, height);
        }
      }
      if (view.geometry.shape === 'text' || view.textProps.text) {
        if (mode === 'fill' || mode === 'both') {
          ctx.fillText(
            view.textProps.text.toString(),
            x,
            y + view.textProps.fontSize
          );
        }
        if (mode === 'stroke' || mode === 'both') {
          ctx.strokeText(
            view.textProps.text.toString(),
            x,
            y + view.textProps.fontSize
          );
        }
        // update size prop based on rendered text size
        // not used by this renderer, but is helpful for referencing from other views
        const metrics = ctx.measureText(view.textProps.text.toString());
        const actualWidth = metrics.width;
        const actualHeight =
          metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent;
        updateSize(actualWidth, actualHeight);
      }
    };

    if (view.fill.color !== 'transparent' && view.fill.opacity !== 0) {
      ctx.fillStyle = view.fill.color;
      ctx.globalAlpha = view.fill.opacity;
      renderShape('fill');
    }
    if (view.stroke.color !== 'transparent' && view.stroke.opacity !== 0) {
      ctx.strokeStyle = view.stroke.color;
      ctx.globalAlpha = view.stroke.opacity;
      ctx.lineWidth = view.stroke.width;
      renderShape('stroke');
    }

    // // case 'circle':
    // //   ctx.globalAlpha = mutableProps.fill.opacity;
    // //   ctx.fillRect(x, y, w, h);
    // //   ctx.globalAlpha = mutableProps.stroke.opacity;
    // //   ctx.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
    // //   break;
    // // case 'line':
    // //   ctx.globalAlpha = mutableProps.fill.opacity;
    // //   ctx.fillRect(x, y, w, h);
    // //   ctx.globalAlpha = mutableProps.stroke.opacity;
    // //   ctx.strokeRect(x, y, w, h);
    // //   break;
    // // case 'text': {
    // //   const textStr = text.toString();
    // //   ctx.font = `${fontWeight} ${fontStyle} ${
    // //     fontSizePx * mutableProps.scale
    // //   }px ${fontFamily}`;
    // //   ctx.globalAlpha = mutableProps.fill.opacity;
    // //   ctx.fillText(textStr, x, y + fontSizePx);
    // //   ctx.globalAlpha = mutableProps.stroke.opacity;
    // //   ctx.strokeText(textStr, x, y + fontSizePx);

    // //   // Calculate actual text dimensions
    // //   const metrics = ctx.measureText(textStr);
    // //   const actualWidth = metrics.width;
    // //   const actualHeight =
    // //     (metrics.actualBoundingBoxAscent || fontSizePx * 0.8) +
    // //     (metrics.actualBoundingBoxDescent || fontSizePx * 0.2);
    // //   mutableProps.bounds = calculateBounds(
    // //     { x, y: y + actualHeight / 2 },
    // //     { width: actualWidth, height: actualHeight }
    // //   );
    //   return;
    // }
    // };
    // renderShape();
  };

  const render = () => {
    draw();
  };

  const update = () => {
    // drawDebugInfo();
    updateViewInState();
  };

  const destroy = () => {
    events.removeEvent('update');
    events.removeEvent('render');
  };

  events.addEvent('update', update);
  events.addEvent('render', render);

  const viewInstance = {
    ...view,
    update,
    destroy,
    events,
    updatePosition,
    updateFillColor,
    updateStrokeColor,
    updateStrokeWidth,
    updateSize,
    updateScale,
    updateText,
    updateFontSize,
  };

  return viewInstance;
};
