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
  const drawDebugInfo = (ctx: CanvasRenderingContext2D, view: View) => {
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
    
    // Draw purple rectangle around the actual rendered bounds
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); // Dashed line
    
    // Draw the bounds rectangle - same as the rendered object
    ctx.strokeRect(anchorX, anchorY, view.size.width, view.size.height);
    
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
    const { x, y } = mutablePosition;
    const { width, height } = mutableProps.shapeProps;

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

    // Debug rendering: Draw anchor point and bounds
    drawDebugInfo(ctx, view);

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
