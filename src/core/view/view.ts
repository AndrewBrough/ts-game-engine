import { CTX, getContext } from '../canvas/canvas';
import { defaultViewConfig } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, Position, StyleProps } from './types';
import { createEvents, type EventName } from '../events/events';
import { Screen } from '../units';
import { loadImage, type ImageLoader } from './loadImage';
import { addComponents } from './components/addComponents';
import type { DeltaTimeEvent } from '../gameState/collisionManager';

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
    const actualWidth =
      metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const actualHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    updateText({
      width: actualWidth,
      height: actualHeight,
    });
    if (view.text.align === 'center' || view.text.verticalAlign === 'center') {
      updateTextOffset({
        x: -actualWidth / 2,
        y: actualHeight / 2,
      });
    } else if (
      view.text.align === 'center-within' ||
      view.text.verticalAlign === 'center-within'
    ) {
      updateTextOffset({
        x: view.geometry.width / 2 - actualWidth / 2,
        y: view.geometry.height / 2 - actualHeight / 2 + actualHeight,
      });
    } else {
      updateTextOffset({
        x: 0,
        y: actualHeight,
      });
    }

    return {
      width: actualWidth,
      height: actualHeight,
    };
  };

  const draw = (mode: 'debug' | 'normal' = 'normal') => {
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
      if (mode === 'debug' && view.geometry.shape !== 'line') {
        const boxOffset = Screen.percent(1).w;
        ctx.strokeStyle = 'violet';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x - boxOffset,
          y - boxOffset,
          w + boxOffset * 2,
          h + boxOffset * 2
        );
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
      }

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

      if (view.geometry.shape === 'circle') {
        ctx.globalAlpha = view.geometry.style.fill.opacity;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.globalAlpha = view.geometry.style.stroke.opacity;
        ctx.stroke();
        ctx.closePath();
      }

      if (view.geometry.shape === 'line') {
        ctx.globalAlpha = view.geometry.style.stroke.opacity;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y + h);
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

        const size = updateTextSize();

        const finalTextPos = {
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

        ctx.strokeRect(finalTextPos.x, finalTextPos.y, size.width, size.height);
      }
    };

    const drawImage = () => {
      if (view.geometry.shape === 'image' && viewImage?.loadedImage) {
        ctx.globalAlpha = view.geometry.style.fill.opacity;
        ctx.drawImage(viewImage.loadedImage, x, y, w, h);
      }
    };

    drawImage();
    drawGeometry();
    drawText();
  };

  const render = (e: DeltaTimeEvent) => {
    // draw('debug');
    draw();
  };

  const update = (e?: DeltaTimeEvent) => {};

  const destroy = () => {
    events.cleanup();
  };

  events.addEvent('update', update);
  events.addEvent('render', render);

  const viewInstance = {
    ...view,
    ...components,
    update,
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
