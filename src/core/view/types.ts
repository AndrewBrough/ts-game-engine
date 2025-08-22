export type ViewRenderProps = {
  fill?: {
    color?: string;
  };
  stroke?: {
    color?: string;
    width?: number;
  };
  /**
   * Position to start drawing from
   */
  anchor?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  /**
   * Relative to the anchor position
   */
  position: {
    x: number;
    y: number;
  };
  shape: 'rect' | 'circle' | 'line' | 'text';
  shapeProps?: {
    width?: number;
    height?: number;
    radius?: number;
  };
  textProps?: {
    text?: string | number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
};
