import { getContext } from '../canvas/canvas';
import type { ViewRenderProps } from './types';

export const createView = (props: ViewRenderProps) => {
  const { fill, stroke, shape, anchor, position, shapeProps, textProps } =
    props;
  const { width = 0, height = 0 } = shapeProps ?? {};

  const getAnchorPosition = (): { x: number; y: number } => {
    switch (anchor) {
      case 'top-right':
        return { x: position.x + width, y: position.y };
      case 'top-left':
        return { x: position.x, y: position.y };
      case 'bottom-right':
        return { x: position.x + width, y: position.y + height };
      case 'bottom-left':
        return { x: position.x, y: position.y + height };
      default:
        return { x: position.x + width / 2, y: position.y + height / 2 };
    }
  };

  const getTextAnchorPosition = (
    fontSize: number,
    ctx: CanvasRenderingContext2D,
    text: string
  ): { x: number; y: number } => {
    // Set font first to get accurate metrics
    ctx.font = `${fontSize}px Arial`;
    const metrics = ctx.measureText(text);

    // Use actual ascent if available, otherwise estimate
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;

    switch (anchor) {
      case 'top-right':
        return { x: position.x + width, y: position.y + ascent };
      case 'top-left':
        return { x: position.x, y: position.y + ascent };
      case 'bottom-right':
        return { x: position.x + width, y: position.y };
      case 'bottom-left':
        return { x: position.x, y: position.y };
      default:
        // For center anchor, position text so it's centered vertically
        return { x: position.x + width / 2, y: position.y + ascent / 2 };
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

    ctx.fillStyle = fill?.color ?? 'pink';
    ctx.strokeStyle = stroke?.color ?? 'violet';
    ctx.lineWidth = stroke?.width ?? 1;

    const { x, y } = getAnchorPosition();

    const {
      text = '🐞',
      fontSize = 32,
      fontFamily = 'Arial',
      fontWeight = 'normal',
      fontStyle = 'normal',
    } = textProps ?? {};

    switch (shape) {
      case 'rect':
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        break;
      case 'circle':
        ctx.fillRect(x, y, width, height);
        ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        break;
      case 'text': {
        const textStr = text?.toString() || '';
        const textPos = getTextAnchorPosition(fontSize, ctx, textStr);
        ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        ctx.fillText(textStr, textPos.x, textPos.y);
        ctx.strokeText(textStr, textPos.x, textPos.y);
        break;
      }
    }
  };

  const bindEvents = () => {
    window.addEventListener('resize', () => {
      draw();
    });
  };

  bindEvents();
  draw();
};
