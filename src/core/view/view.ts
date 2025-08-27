import { CTX, getContext } from '../canvas/canvas';
import { defaultViewConfig } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, Position, StyleProps } from './types';
import { createEvents, type EventName } from '../events/events';
import { Screen } from '../units';
import { loadImage, type ImageLoader } from './loadImage';
import { addComponents } from './components/addComponents';

export type ViewInstance = ReturnType<typeof createView> & {
  handlers: Map<EventName, (e: CustomEvent) => void>;
};

export const createView = (props: DeepPartial<View> = {}) => {
  const view = deepMerge({ ...defaultViewConfig }, props, {
    id: props.id ?? `entity-${crypto.randomUUID()}`,
  }) as View;
  const components = addComponents();
  const events = createEvents();
  const viewImage: ImageLoader | null = view.imageUrl ? loadImage(view) : null;

  // Wait for the image to load initially
  if (viewImage) {
    viewImage.image.catch(error => {
      console.error('Failed to load initial image:', error);
    });
  }

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

    // If we have an image and the style changed, reload it to update colors
    if (viewImage && (props.fill || props.stroke)) {
      viewImage.reload(view).catch(error => {
        console.error('Failed to reload image:', error);
      });
    }
  };

  const updateTextStyle = (props: DeepPartial<StyleProps>) => {
    view.text.style = deepMerge(view.text.style, props);
  };

  // Function to update shape size
  const updateSize = (width: number, height: number) => {
    view.geometry.width = width;
    view.geometry.height = height;
  };

  const updateTextOffset = (offset: Position) => {
    view.text.offset = offset;
  };

  // Function to update scale
  const updateScale = (scale: number) => {
    view.scale = scale;
  };

  // Function to update font size
  const updateFontSize = (fontSize: number) => {
    view.text.fontSize = fontSize;
  };

  const updateText = (props: DeepPartial<View['text']>) => {
    view.text = {
      ...view.text,
      ...props,
    } as View['text'];
  };

  const updateTextSize = () => {
    // update size prop based on rendered text size
    // not used by this renderer, but is helpful for referencing from other views
    const metrics = CTX.measureText(view.text.text.toString());
    const actualWidth = metrics.width;
    const actualHeight =
      metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent;

    if (view.text.offset === 'center') {
      updateTextOffset({
        x: -actualWidth,
        y: actualHeight / 2,
      });
    } else {
      // updateTextOffset({
      //   x: 0,
      //   y: actualHeight,
      // });
    }

    return {
      width: actualWidth,
      height: actualHeight,
    };
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

    const drawImage = () => {
      if (view.geometry.shape === 'image' && viewImage?.loadedImage) {
        // ctx.globalAlpha = view.geometry.style.fill.opacity;
        ctx.drawImage(viewImage.loadedImage, x, y, w, h);
      }
    };

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
        if (view.text.offset === 'center') {
          updateTextSize();
        }

        ctx.fillStyle = view.text.style.fill.color;
        ctx.strokeStyle = view.text.style.stroke.color;
        ctx.lineWidth = view.text.style.stroke.width * view.scale;
        ctx.font = `${view.text.fontWeight} ${view.text.fontStyle} ${
          view.text.fontSize * view.scale
        }px ${view.text.fontFamily}`;

        const finalTextPos =
          view.text.offset === 'center'
            ? { x: 0, y: 0 }
            : {
                x: x + (view.text.offset?.x ?? 0),
                y: y + (view.text.offset?.y ?? 0),
              };

        ctx.globalAlpha = view.text.style.fill.opacity;
        ctx.fillText(view.text.text.toString(), finalTextPos.x, finalTextPos.y);

        ctx.globalAlpha = view.text.style.stroke.opacity;
        ctx.strokeText(
          view.text.text.toString(),
          finalTextPos.x,
          finalTextPos.y
        );
      }
    };

    drawImage();
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
    // updateViewInState();
  };

  const cleanup = () => {
    console.log('cleanup view', view.id);
  };

  const destroy = () => {
    console.log('destroy view', view.id);
    events.cleanup();
    cleanup();
  };

  events.addEvent('update', update);
  events.addEvent('render', render);

  const viewInstance = {
    ...view,
    ...components,
    update,
    cleanup,
    destroy,
    events,
    updatePosition,
    updateGeometryStyle,
    updateTextStyle,
    updateTextSize,
    updateTextOffset,
    updateSize,
    updateScale,
    updateText,
    updateFontSize,
    viewImage,
    handlers: new Map(),
  };

  window.dispatchEvent(
    new CustomEvent('viewAdded', { detail: { view: viewInstance } })
  );

  return viewInstance;
};
