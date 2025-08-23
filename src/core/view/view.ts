import { getContext } from '../canvas/canvas';
import { config } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial } from '../types';
import type { View, ViewRenderProps, ViewInstance } from './types';
import { addView, getState } from '../state/state';
import { createEvents } from '../events/events';
import { convertFontSizeToPixels, convertSizeToPixels } from '../conversions';

export const createView = (props: DeepPartial<ViewRenderProps> = config): ViewInstance => {
  const mergedProps = deepMerge(config, props);
  const events = createEvents();
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
  const updateViewInState = (view: View) => {
    const stateViews = getState().views;
    const viewIndex = stateViews.findIndex((v: View) => v.id === viewId);
    if (viewIndex !== -1) {
      stateViews[viewIndex] = view;
    } else {
      addView(view);
    }
  };

  // Function to update the position and trigger a redraw
  const updatePosition = (newPosition: { x: number; y: number }) => {
    mutablePosition.x = newPosition.x;
    mutablePosition.y = newPosition.y;
  };

  // Function to update fill color
  const updateFillColor = (color: string) => {
    mutableProps.fill.color = color;
  };

  // Function to update stroke color
  const updateStrokeColor = (color: string) => {
    mutableProps.stroke.color = color;
  };

  // Function to update stroke width
  const updateStrokeWidth = (width: number) => {
    mutableProps.stroke.width = width;
  };

  // Function to update shape size
  const updateSize = (width: number, height: number) => {
    const getConvertedSize = () => {
      if(shape === "text") {
        const convertedWidth = convertFontSizeToPixels(width);
        const convertedHeight = convertFontSizeToPixels(height);
        return { width: convertedWidth, height: convertedHeight };
      } else {
        return convertSizeToPixels(width, height);
      }
    }
    const { width: convertedWidth, height: convertedHeight } = getConvertedSize();
    mutableProps.shapeProps.width = convertedWidth;
    mutableProps.shapeProps.height = convertedHeight;
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
  // const drawDebugInfo = (view: View) => {
  //   const ctx = getContext();
  //   if (!ctx) {
  //     throw new Error('Context not found');
  //   }

  //   // Save current context state
  //   ctx.save();
    
  //   // Draw purple dot at anchor point
  //   ctx.fillStyle = 'purple';
  //   ctx.strokeStyle = 'purple';
  //   ctx.lineWidth = 2;
    
  //   // Draw a small circle at the anchor position
  //   const anchorX = view.position.x;
  //   const anchorY = view.position.y;
  //   ctx.beginPath();
  //   ctx.arc(anchorX, anchorY, 3, 0, 2 * Math.PI);
  //   ctx.fill();
    
  //   // Draw purple rectangle around the actual rendered bounds
  //   ctx.strokeStyle = 'purple';
  //   ctx.lineWidth = 1;
  //   ctx.setLineDash([5, 5]); // Dashed line
    
  //   // Draw the bounds rectangle - same as the rendered object
  //   ctx.strokeRect(anchorX, anchorY, view.size.width, view.size.height);
    
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

    // Use props directly - no conversion, no anchor calculations
    const { width, height } = mutableProps.shapeProps;
    const { x, y } = mutableProps.position;

    const {
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
    } = mutableProps.textProps;

    const view: View = {
      id: viewId,
      position: { x, y },
      size: { width, height },
    };

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
        const textStr = text.toString();
        ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(textStr);
        const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
        
        view.size.width = metrics.width;
        view.size.height = ascent;
        
        ctx.fillText(textStr, x, y);
        ctx.strokeText(textStr, x, y);
        break;
      }
    }

    return view;
  };

  const update = () => {
    const view = draw();
    // drawDebugInfo(view);
    updateViewInState(view);
  };

  return {
    update,
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
