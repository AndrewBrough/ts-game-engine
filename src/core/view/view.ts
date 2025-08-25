import { getContext } from '../canvas/canvas';
import { defaultViewConfig } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, AnyView, Position, StyleProps } from './types';
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

  // Function to update stroke color
  const updateGeometryStyle = (props: DeepPartial<StyleProps>) => {
    view.geometry.style = deepMerge(view.geometry.style, props);
  };

  const updateTextStyle = (props: DeepPartial<StyleProps>) => {
    view.text.style = deepMerge(view.text.style, props);
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
    view.text.text = text;
  };

  // Function to update font size
  const updateFontSize = (fontSize: number) => {
    view.text.fontSize = fontSize;
  };

  const draw = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    const { x: unscaledX, y: unscaledY, width, height } = view.geometry;
    const w = width * view.scale;
    const h = height * view.scale;
    const scaledDiff = {
      w: w - width,
      h: h - height,
    };
    const x = unscaledX - scaledDiff.w;
    const y = unscaledY - scaledDiff.h;

    const drawGeometry = () => {
      ctx.fillStyle = view.geometry.style.fill.color;
      ctx.strokeStyle = view.geometry.style.stroke.color;
      ctx.lineWidth = view.geometry.style.stroke.width * view.scale;

      if (view.geometry.shape === 'rect') {
        ctx.globalAlpha = view.geometry.style.fill.opacity;
        ctx.fillRect(x, y, w, h);

        ctx.globalAlpha = view.geometry.style.stroke.opacity;
        ctx.strokeRect(x, y, w, h);
      }

      if (view.geometry.shape === 'roundRect') {
        ctx.globalAlpha = view.geometry.style.fill.opacity;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, view.geometry.style.radii);
        ctx.fill();

        ctx.globalAlpha = view.geometry.style.stroke.opacity;
        ctx.stroke();
        ctx.closePath();
      }
    };

    const drawText = () => {
      if (view.text.text) {
        ctx.fillStyle = view.text.style.fill.color;
        ctx.strokeStyle = view.text.style.stroke.color;
        ctx.lineWidth = view.text.style.stroke.width * view.scale;
        ctx.font = `${view.text.fontWeight} ${view.text.fontStyle} ${
          view.text.fontSize * view.scale
        }px ${view.text.fontFamily}`;

        const tPos = (() => {
          if (view.text.offset === 'center') {
            return {
              x: x + w / 4,
              y: y - h / 4,
            };
          }
          return {
            x: x + (view.text.offset?.x ?? 0),
            y: y + (view.text.offset?.y ?? 0),
          };
        })();
        console.log(x, y, tPos);

        ctx.globalAlpha = view.text.style.fill.opacity;
        ctx.fillText(view.text.text.toString(), tPos.x, tPos.y + h);

        ctx.globalAlpha = view.text.style.stroke.opacity;
        ctx.strokeText(view.text.text.toString(), tPos.x, tPos.y + h);

        if (view.geometry.height === 0) {
          // update size prop based on rendered text size
          // not used by this renderer, but is helpful for referencing from other views
          const metrics = ctx.measureText(view.text.text.toString());
          const actualWidth = metrics.width;
          const actualHeight =
            metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent;
          updateSize(actualWidth, actualHeight);
        }
      }
    };

    drawGeometry();
    drawText();

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
    updateGeometryStyle,
    updateTextStyle,
    updateSize,
    updateScale,
    updateText,
    updateFontSize,
  };

  return viewInstance;
};
