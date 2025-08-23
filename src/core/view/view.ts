import { getContext } from '../canvas/canvas';
import { config } from '../config';
import { deepMerge } from '../utils/deepMerge';
import type { DeepPartial, DeepRequired } from '../types';
import type { View } from './types';
import { addView, getState } from '../state/state';
import { createEvents } from '../events/events';
import { convertFontSizeToPixels, convertPositionToPixels, convertSizeToPixels } from '../conversions';
import { calculateBounds } from './collision';

export type ViewInstance = ReturnType<typeof createView>;

export const createView = (props: DeepPartial<View> = config) => {
  const mergedProps = deepMerge(config, props);
  const events = createEvents();
  
  // Create mutable copies of all props that can be updated
  const mutableProps: View = {
    id: props.id ?? crypto.randomUUID(),
    fill: { ...mergedProps.fill },
    stroke: { ...mergedProps.stroke },
    shapeProps: { ...mergedProps.shapeProps },
    textProps: { ...mergedProps.textProps },
    position: { x: mergedProps.position.x, y: mergedProps.position.y },
    anchor: mergedProps.anchor,
    units: mergedProps.units,
    relativeTo: mergedProps.relativeTo,
    shape: mergedProps.shape,
    bounds: { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 },
  };

  // Helper function to update the view in state
  const updateViewInState = (view: DeepRequired<View>) => {
    const stateViews = getState().views;
    const viewIndex = stateViews.findIndex((v: View) => v.id === mutableProps.id);
    if (viewIndex !== -1) {
      stateViews[viewIndex] = {...stateViews[viewIndex], ...view} as View;
    } else {
      addView({...mutableProps, ...view} as View);
    }
  };

  // Function to update the position and trigger a redraw
  const updatePosition = (newPosition: { x: number; y: number }) => {
    mutableProps.position.x = newPosition.x;
    mutableProps.position.y = newPosition.y;
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
    mutableProps.shapeProps.width = width;
    mutableProps.shapeProps.height = height;
      
    // if(mutableProps.shape === "text") {
    //   // For text, calculate actual rendered dimensions using canvas metrics
    //   const ctx = getContext();
    //   if (!ctx) {
    //     throw new Error('Context not found');
    //   }
      
    //   const textStr = mutableProps.textProps.text.toString();
    //   const { fontSize, fontFamily, fontWeight, fontStyle } = mutableProps.textProps;
      
    //   // Set the font to measure text metrics
    //   ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
    //   const metrics = ctx.measureText(textStr);
      
    //   // Calculate actual text dimensions
    //   const textWidth = metrics.width;
    //   const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
    //   const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
    //   const textHeight = ascent + descent;
      
    //   mutableProps.shapeProps.width = textWidth;
    //   mutableProps.shapeProps.height = textHeight;
    // } else {
    //   // For non-text shapes, use regular size conversion
    //   const { width: convertedWidth, height: convertedHeight } = convertSizeToPixels(width, height);
    //   mutableProps.shapeProps.width = convertedWidth;
    //   mutableProps.shapeProps.height = convertedHeight;
    // }
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
  const drawDebugInfo = () => {
    const ctx = getContext();
    if (!ctx) {
      throw new Error('Context not found');
    }

    // Save current context state
    ctx.save();
    
    // Draw purple dot at anchor point
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;
    
    const { left, right, top, bottom } = mutableProps.bounds;
    // Draw a small circle at the anchor position
    ctx.beginPath();
    ctx.arc(left, top, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw purple rectangle around the actual rendered bounds
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    
    // Draw the bounds rectangle - same as the rendered object
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

    // Use props directly - no conversion, no anchor calculations
    const { width: w, height: h } = convertSizeToPixels(mutableProps.shapeProps.width, mutableProps.shapeProps.height);
    const positionInPixels = convertPositionToPixels(mutableProps.position.x, mutableProps.position.y);
    const { x, y } = positionInPixels;
    const {
      text,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
    } = mutableProps.textProps;
    mutableProps.bounds = { left: x, right: x + w, top: y, bottom: y + h, width: w, height: h };
    

    const fontSizePx = convertFontSizeToPixels(fontSize);

    const renderShape = () => {
      switch (mutableProps.shape) {
        case 'rect':
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          break;
        case 'circle':
          ctx.fillRect(x, y, w, h);
          ctx.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
          break;
        case 'line':
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          break;
        case 'text': {
          const textStr = text.toString();
          ctx.font = `${fontWeight} ${fontStyle} ${fontSizePx}px ${fontFamily}`;
          ctx.fillText(textStr, x, y + fontSizePx);
          ctx.strokeText(textStr, x, y + fontSizePx);
          
          // Calculate actual text dimensions
          const metrics = ctx.measureText(textStr);
          const actualWidth = metrics.width;
          const actualHeight = (metrics.actualBoundingBoxAscent || fontSizePx * 0.8) + 
          (metrics.actualBoundingBoxDescent || fontSizePx * 0.2);
          mutableProps.shapeProps.width = actualWidth;
          mutableProps.shapeProps.height = actualHeight;
          mutableProps.bounds = calculateBounds({ x, y: y + actualHeight/2 }, { width: actualWidth, height: actualHeight }, mutableProps.anchor);
          console.log(mutableProps.bounds, mutableProps.anchor);
          return;
        }
      }
    }
    renderShape();
  };

  const update = () => {
    draw();
    drawDebugInfo();
    updateViewInState(mutableProps);
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
