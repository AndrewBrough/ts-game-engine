import { getContext, getCanvas } from '../canvas/canvas';
import { config, textConfig } from '../config';
import {
  convertPositionToPixels,
  convertSizeToPixels,
  convertFontSizeToPixels,
} from '../conversions';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, ViewRenderProps, ViewInstance } from './types';
import { addView, getState } from '../state/state';
import { createEvents } from '../events/events';

export const createView = (props: DeepPartial<ViewRenderProps> = config): ViewInstance => {
  const events = createEvents();

  // Auto-detect text shape if textProps.text has content and shape isn't explicitly set
  const hasTextContent = props.textProps?.text !== undefined && 
                        props.textProps?.text !== null && 
                        props.textProps?.text !== '';
  
  const shouldBeTextShape = props.shape === 'text' || 
                           (props.shape === undefined && hasTextContent);
  
  // Merge with config defaults using deep merge
  const baseConfig = { ...config, ...(shouldBeTextShape ? textConfig : {}) };
  const mergedProps = deepMerge(baseConfig, props) as ViewRenderProps;
  
  // Ensure shape is set to 'text' if auto-detected
  if (shouldBeTextShape && mergedProps.shape !== 'text') {
    mergedProps.shape = 'text';
  }
  
  const {
    fill,
    stroke,
    shape,
    anchor,
    position,
    units,
    relativeTo,
    shapeProps,
    textProps,
  } = mergedProps;

  // Create a mutable view state that can be updated
  let currentView: View | null = null;
  const mutablePosition = { x: position.x, y: position.y };
  
  // Create a unique ID for this view
  const viewId = crypto.randomUUID();
  
  // Create mutable copies of all props that can be updated
  const mutableProps = {
    fill: { ...fill },
    stroke: { ...stroke },
    shapeProps: { ...shapeProps },
    textProps: { ...textProps },
    position: mutablePosition,
    anchor,
    units,
    relativeTo,
    shape
  };

  // Helper function to update the view in state
  const updateViewInState = () => {
    currentView = draw();
    const stateViews = getState().views;
    const viewIndex = stateViews.findIndex((v: View) => v.id === viewId);
    if (viewIndex !== -1) {
      stateViews[viewIndex] = currentView;
    }
  };
  const { width, height } = shapeProps;

  const getScreenRelativePosition = (): { x: number; y: number } => {
    const canvas = getCanvas();
    const screenWidth = canvas.width;
    const screenHeight = canvas.height;
    
    // Convert position to pixels for offset from the screen corner/center
    const pixelOffset = convertPositionToPixels(mutablePosition.x, mutablePosition.y, units);
    
    switch (relativeTo) {
      case 'top-right':
        return { 
          x: screenWidth - pixelOffset.x, 
          y: pixelOffset.y 
        };
      case 'top-left':
        return { 
          x: pixelOffset.x, 
          y: pixelOffset.y 
        };
      case 'bottom-right':
        return { 
          x: screenWidth - pixelOffset.x, 
          y: screenHeight - pixelOffset.y 
        };
      case 'bottom-left':
        return { 
          x: pixelOffset.x, 
          y: screenHeight - pixelOffset.y 
        };
      case 'center':
        return { 
          x: screenWidth / 2 + pixelOffset.x, 
          y: screenHeight / 2 + pixelOffset.y 
        };
      default:
        return pixelOffset;
    }
  };

  const getAnchorPosition = (): { x: number; y: number } => {
    // If relativeTo is specified, use screen-relative positioning
    if (relativeTo) {
      return getScreenRelativePosition();
    }
    
    // Convert position and size to pixels
    const pixelPosition = convertPositionToPixels(
      mutablePosition.x,
      mutablePosition.y,
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
  ): View => {
    // If relativeTo is specified, use screen-relative positioning for text
    if (relativeTo) {
      const screenPos = getScreenRelativePosition();
      const pixelFontSize = convertFontSizeToPixels(fontSize, units);

      // Set font first to get accurate metrics
      ctx.font = `${pixelFontSize}px Arial`;
      const metrics = ctx.measureText(text);

      // Use actual ascent if available, otherwise estimate
      const ascent = metrics.actualBoundingBoxAscent || pixelFontSize * 0.8;

      switch (relativeTo) {
        case 'top-right':
          return {
            id: viewId,
            position: {
              x: screenPos.x - metrics.width,
              y: screenPos.y + ascent,
            },
            size: {
              width: metrics.width,
              height: ascent,
            },
          };
        case 'top-left':
          return { id: viewId, position: { x: screenPos.x, y: screenPos.y + ascent }, size: { width: metrics.width, height: ascent } };
        case 'bottom-right':
          return { id: viewId, position: { x: screenPos.x - metrics.width, y: screenPos.y }, size: { width: metrics.width, height: ascent } };
        case 'bottom-left':
          return { id: viewId, position: { x: screenPos.x, y: screenPos.y }, size: { width: metrics.width, height: ascent } };
        case 'center':
          return {
            id: viewId,
            position: {
              x: screenPos.x - metrics.width / 2,
              y: screenPos.y + ascent / 2,
            },
            size: {
              width: metrics.width,
              height: ascent,
            },
          };
        default:
          return { id: viewId, position: screenPos, size: { width: metrics.width, height: ascent } };
      }
    }
    
    // Convert position, size, and font size to pixels
    const pixelPosition = convertPositionToPixels(
      mutablePosition.x,
      mutablePosition.y,
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
          id: viewId,
          position: {
            x: pixelPosition.x + pixelSize.width,
            y: pixelPosition.y + ascent,
          },
          size: {
            width: metrics.width,
            height: ascent,
          },
        };
      case 'top-left':
        return { id: viewId, position: { x: pixelPosition.x, y: pixelPosition.y + ascent }, size: { width: metrics.width, height: ascent } };
      case 'bottom-right':
        return { id: viewId, position: { x: pixelPosition.x + pixelSize.width, y: pixelPosition.y }, size: { width: metrics.width, height: ascent } };
      case 'bottom-left':
        return { id: viewId, position: { x: pixelPosition.x, y: pixelPosition.y }, size: { width: metrics.width, height: ascent } };
      default:
        // For center anchor, position text so it's centered vertically
        return {
          id: viewId,
          position: {
            x: pixelPosition.x + pixelSize.width / 2,
            y: pixelPosition.y + ascent / 2,
          },
          size: {
            width: metrics.width,
            height: ascent,
          },
        };
    }
  };

  if (!shape) {
    throw new Error('Shape is required');
  }

  // Function to update the position and trigger a redraw
  const updatePosition = (newPosition: { x: number; y: number }) => {
    mutablePosition.x = newPosition.x;
    mutablePosition.y = newPosition.y;
    updateViewInState();
    // Trigger a redraw by dispatching an update event
    window.dispatchEvent(new Event('update'));
  };

  // Function to update fill color
  const updateFillColor = (color: string) => {
    mutableProps.fill.color = color;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Function to update stroke color
  const updateStrokeColor = (color: string) => {
    mutableProps.stroke.color = color;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Function to update stroke width
  const updateStrokeWidth = (width: number) => {
    mutableProps.stroke.width = width;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Function to update shape size
  const updateSize = (width: number, height: number) => {
    mutableProps.shapeProps.width = width;
    mutableProps.shapeProps.height = height;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Function to update text
  const updateText = (text: string | number) => {
    mutableProps.textProps.text = text;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Function to update font size
  const updateFontSize = (fontSize: number) => {
    mutableProps.textProps.fontSize = fontSize;
    updateViewInState();
    window.dispatchEvent(new Event('update'));
  };

  // Debug function to draw anchor point and bounds
  const drawDebugInfo = (ctx: CanvasRenderingContext2D, view: View, anchor: string) => {
    // Save current context state
    ctx.save();
    
    // Draw purple dot at anchor point
    ctx.fillStyle = 'purple';
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    
    // Draw a small circle at the anchor position
    const anchorX = view.position.x;
    const anchorY = view.position.y;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw purple rectangle around calculated bounds
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // Dashed line
    
    // Calculate bounds based on anchor
    let left, right, top, bottom;
    let halfWidth, halfHeight;
    
    switch (anchor) {
      case 'top-left':
        left = anchorX;
        right = anchorX + view.size.width;
        top = anchorY;
        bottom = anchorY + view.size.height;
        break;
      case 'top-right':
        left = anchorX - view.size.width;
        right = anchorX;
        top = anchorY;
        bottom = anchorY + view.size.height;
        break;
      case 'bottom-left':
        left = anchorX;
        right = anchorX + view.size.width;
        top = anchorY - view.size.height;
        bottom = anchorY;
        break;
      case 'bottom-right':
        left = anchorX - view.size.width;
        right = anchorX;
        top = anchorY - view.size.height;
        bottom = anchorY;
        break;
      case 'center':
      default:
        halfWidth = view.size.width / 2;
        halfHeight = view.size.height / 2;
        left = anchorX - halfWidth;
        right = anchorX + halfWidth;
        top = anchorY - halfHeight;
        bottom = anchorY + halfHeight;
        break;
    }
    
    // Draw the bounds rectangle
    ctx.strokeRect(left, top, right - left, bottom - top);
    
    // Restore context state
    ctx.restore();
  };

  const draw = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    ctx.fillStyle = mutableProps.fill.color;
    ctx.strokeStyle = mutableProps.stroke.color;
    ctx.lineWidth = mutableProps.stroke.width;

    const { x, y } = getAnchorPosition();
    const pixelSize = convertSizeToPixels(width, height, units);

    const {
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
    } = mutableProps.textProps;

    const view: View = {
      id: viewId,
      position: {
        x,
        y,
      },
      size: {
        width: pixelSize.width,
        height: pixelSize.height,
      },
    };

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
        view.size.width = textPos.size.width;
        view.size.height = textPos.size.height;
        ctx.font = `${fontWeight} ${fontStyle} ${pixelFontSize}px ${fontFamily}`;
        ctx.fillText(textStr, textPos.position.x, textPos.position.y);
        ctx.strokeText(textStr, textPos.position.x, textPos.position.y);
        break;
      }
    }

    // Debug rendering: Draw anchor point and bounds
    drawDebugInfo(ctx, view, anchor);

    return view;
  };

  currentView = draw();
  addView(currentView);
  events.addEvent('resize', () => {
    currentView = draw();
  });
  events.addEvent('update', () => {
    currentView = draw();
  });

  return {
    view: currentView,
    events,
    updatePosition,
    updateFillColor,
    updateStrokeColor,
    updateStrokeWidth,
    updateSize,
    updateText,
    updateFontSize,
    props: mutableProps,
  }
};
