import { getContext } from '../canvas/canvas';
import { config } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial, DeepRequired } from '../types';
import type {
  View,
  InteractiveView,
  AnyViewInstance,
  AnyView,
  Position,
} from './types';
import { addView, getViewsOnLayer } from '../gameState/gameState';
import { createEvents } from '../events/events';

export type ViewInstance = ReturnType<typeof createView>;

export const createView = (
  props: DeepPartial<View | InteractiveView> = config
) => {
  const mergedProps = deepMerge(config, props);
  const events = createEvents();

  // Create mutable copies of all props that can be updated
  const mutableProps: View | InteractiveView = {
    ...mergedProps,
    id: props.id ?? crypto.randomUUID(),
    model: props.model ?? {},
    layer: props.layer ?? 'DEFAULT',
    scale: props.scale ?? 1,
    relativeTo: mergedProps.relativeTo,
    physics: mergedProps.physics ?? config.physics,
    ...('handlers' in mergedProps && { handlers: mergedProps.handlers }),
    interactive: true,
  };

  // Helper function to update the view in state
  const updateViewInState = (view: DeepRequired<AnyView>) => {
    const stateViews = getViewsOnLayer(mutableProps?.layer ?? 'DEFAULT');
    const viewIndex = stateViews.findIndex(
      (v: AnyView) => v.id === mutableProps.id
    );
    if (viewIndex !== -1) {
      // Override view in state if it already exists
      stateViews[viewIndex] = {
        ...stateViews[viewIndex],
        ...view,
      } as AnyView;
    } else {
      // Add view to state if it doesn't exist
      addView({ ...mutableProps, ...view } as AnyView);
    }
  };

  // Function to update the position and trigger a redraw
  const updatePosition = (newPosition: Position) => {
    const { x, y } = newPosition;
    const maxX = 100 - mutableProps.geometry.width;
    const maxY = 100 - mutableProps.geometry.height;
    console.log(maxX, maxY, x, y);
    mutableProps.geometry.x = Math.max(0, Math.min(maxX, x));
    mutableProps.geometry.y = Math.max(0, Math.min(maxY, y));
  };

  // Function to update fill color
  const updateFillColor = (fill: { color?: string; opacity?: number }) => {
    mutableProps.fill.color = fill.color ?? mutableProps.fill.color;
    mutableProps.fill.opacity = fill.opacity ?? mutableProps.fill.opacity;
  };

  // Function to update stroke color
  const updateStrokeColor = (stroke: {
    color?: string;
    opacity?: number;
    width?: number;
  }) => {
    mutableProps.stroke.color = stroke.color ?? mutableProps.stroke.color;
    mutableProps.stroke.opacity = stroke.opacity ?? mutableProps.stroke.opacity;
    mutableProps.stroke.width = stroke.width ?? mutableProps.stroke.width;
  };

  // Function to update stroke width
  const updateStrokeWidth = (width: number) => {
    mutableProps.stroke.width = width;
  };

  // Function to update shape size
  const updateSize = (width: number, height: number) => {
    mutableProps.geometry.width = width;
    mutableProps.geometry.height = height;
  };

  // Function to update scale
  const updateScale = (scale: number) => {
    mutableProps.scale = scale;
  };

  // Function to update text
  const updateText = (text: string | number) => {
    mutableProps.textProps.text = text;
  };

  // Function to update font size
  const updateFontSize = (fontSize: number) => {
    mutableProps.textProps.fontSize = fontSize;
  };

  // Debug function to draw anchor point and bounds
  // const drawDebugInfo = () => {
  //   const ctx = getContext();
  //   if (!ctx) {
  //     throw new Error('Context not found');
  //   }

  //   // Save current context state
  //   ctx.save();

  //   // Draw purple dot at anchor point
  //   ctx.fillStyle = 'purple';
  //   ctx.strokeStyle = 'purple';
  //   ctx.lineWidth = 5;

  //   const { left, right, top, bottom } = mutableProps.bounds || {
  //     left: 0,
  //     right: 0,
  //     top: 0,
  //     bottom: 0,
  //   };
  //   // Draw a small circle at the anchor position
  //   ctx.beginPath();
  //   ctx.arc(left, top, 3, 0, 2 * Math.PI);
  //   ctx.fill();

  //   // Draw yellow rectangle around the actual rendered bounds
  //   ctx.strokeStyle = 'yellow';
  //   ctx.lineWidth = 2;

  //   // Draw the bounds rectangle - same as the rendered object
  //   ctx.strokeRect(left, top, right - left, bottom - top);

  //   // Restore context state
  //   ctx.restore();
  // };

  const draw = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    ctx.fillStyle = mutableProps.fill.color;
    ctx.strokeStyle = mutableProps.stroke.color;
    ctx.lineWidth = mutableProps.stroke.width;

    // const relativeTo = mutableProps.relativeTo;
    // const relativeAnchor = {
    //   x: 0,
    //   y: 0,
    // };
    // const { width, height } = mutableProps.bounds || sizeInPixels;
    // const w = width * mutableProps.scale;
    // const h = height * mutableProps.scale;
    // const wScaleDiff = w - width;
    // const hScaleDiff = h - height;
    // switch (relativeTo) {
    //   case 'top-right':
    //     relativeAnchor.x = window.innerWidth - w;
    //     relativeAnchor.y = -h / 2;
    //     break;
    //   case 'top-left':
    //     relativeAnchor.x = 0;
    //     relativeAnchor.y = -h / 2;
    //     break;
    //   case 'bottom-right':
    //     relativeAnchor.x = window.innerWidth - w;
    //     relativeAnchor.y = window.innerHeight;
    //     break;
    //   case 'bottom-left':
    //     relativeAnchor.x = 0;
    //     relativeAnchor.y = window.innerHeight;
    //     break;
    // }

    // const { x, y } = {
    //   x:
    //     relativeAnchor.x +
    //     mutableProps.position.x +
    //     positionInPixels.x +
    //     wScaleDiff,
    //   y:
    //     relativeAnchor.y +
    //     mutableProps.position.y +
    //     positionInPixels.y +
    //     hScaleDiff,
    // };

    // const { text, fontSize, fontFamily, fontWeight, fontStyle } =
    //   mutableProps.textProps;
    // const fontSizePx = convertFontSizeToPixels(mutableProps.textProps.fontSize);

    const { x, y, width, height } = mutableProps.geometry;

    // const renderShape = () => {
    ctx.globalAlpha = mutableProps.fill.opacity;
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = mutableProps.stroke.opacity;
    ctx.strokeRect(x, y, width, height);

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
    updateViewInState(mutableProps);
  };

  const destroy = () => {
    events.removeEvent('update');
    events.removeEvent('render');
  };

  events.addEvent('update', update);
  events.addEvent('render', render);

  const viewInstance = {
    ...mutableProps,
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
