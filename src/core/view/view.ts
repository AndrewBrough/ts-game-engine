import { getContext } from '../canvas/canvas';
import { config } from '../config';
import {
  convertPositionToPixels,
  convertSizeToPixels,
  convertFontSizeToPixels,
  addResizeListener,
} from '../conversions';
import type { DeepPartial } from '../types';
import type { ViewRenderProps } from './types';

export const createView = (props: DeepPartial<ViewRenderProps> = config) => {
  // Merge with config defaults
  const mergedProps = { ...config, ...props } as ViewRenderProps;
  const {
    fill,
    stroke,
    shape,
    anchor,
    position,
    units,
    shapeProps,
    textProps,
  } = mergedProps;
  const { width, height } = shapeProps;

  const getAnchorPosition = (): { x: number; y: number } => {
    // Convert position and size to pixels
    const pixelPosition = convertPositionToPixels(
      position.x,
      position.y,
      units
    );
    const pixelSize = convertSizeToPixels(width, height, units);

    switch (anchor) {
      case 'top-right':
        return { x: pixelPosition.x + pixelSize.width, y: pixelPosition.y };
      case 'top-left':
        return { x: pixelPosition.x, y: pixelPosition.y };
      case 'bottom-right':
        return {
          x: pixelPosition.x + pixelSize.width,
          y: pixelPosition.y + pixelSize.height,
        };
      case 'bottom-left':
        return { x: pixelPosition.x, y: pixelPosition.y + pixelSize.height };
      default:
        return {
          x: pixelPosition.x + pixelSize.width / 2,
          y: pixelPosition.y + pixelSize.height / 2,
        };
    }
  };

  const getTextAnchorPosition = (
    fontSize: number,
    ctx: CanvasRenderingContext2D,
    text: string
  ): { x: number; y: number } => {
    // Convert position, size, and font size to pixels
    const pixelPosition = convertPositionToPixels(
      position.x,
      position.y,
      units
    );
    const pixelSize = convertSizeToPixels(width, height, units);
    const pixelFontSize = convertFontSizeToPixels(fontSize, units);

    // Set font first to get accurate metrics
    ctx.font = `${pixelFontSize}px Arial`;
    const metrics = ctx.measureText(text);

    // Use actual ascent if available, otherwise estimate
    const ascent = metrics.actualBoundingBoxAscent || pixelFontSize * 0.8;

    switch (anchor) {
      case 'top-right':
        return {
          x: pixelPosition.x + pixelSize.width,
          y: pixelPosition.y + ascent,
        };
      case 'top-left':
        return { x: pixelPosition.x, y: pixelPosition.y + ascent };
      case 'bottom-right':
        return { x: pixelPosition.x + pixelSize.width, y: pixelPosition.y };
      case 'bottom-left':
        return { x: pixelPosition.x, y: pixelPosition.y };
      default:
        // For center anchor, position text so it's centered vertically
        return {
          x: pixelPosition.x + pixelSize.width / 2,
          y: pixelPosition.y + ascent / 2,
        };
    }
  };

  if (!shape) {
    throw new Error('Shape is required');
  }

  const draw = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    ctx.fillStyle = fill.color;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;

    const { x, y } = getAnchorPosition();
    const pixelSize = convertSizeToPixels(width, height, units);

    const {
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
    } = textProps;

    switch (shape) {
      case 'rect':
        ctx.fillRect(x, y, pixelSize.width, pixelSize.height);
        ctx.strokeRect(x, y, pixelSize.width, pixelSize.height);
        break;
      case 'circle':
        ctx.fillRect(x, y, pixelSize.width, pixelSize.height);
        ctx.ellipse(x, y, pixelSize.width, pixelSize.height, 0, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.fillRect(x, y, pixelSize.width, pixelSize.height);
        ctx.strokeRect(x, y, pixelSize.width, pixelSize.height);
        break;
      case 'text': {
        const textStr = text.toString();
        const pixelFontSize = convertFontSizeToPixels(fontSize, units);
        const textPos = getTextAnchorPosition(fontSize, ctx, textStr);
        ctx.font = `${fontWeight} ${fontStyle} ${pixelFontSize}px ${fontFamily}`;
        ctx.fillText(textStr, textPos.x, textPos.y);
        ctx.strokeText(textStr, textPos.x, textPos.y);
        break;
      }
    }
  };

  const bindEvents = () => {
    addResizeListener(() => {
      draw();
    });
  };

  bindEvents();
  draw();
};
