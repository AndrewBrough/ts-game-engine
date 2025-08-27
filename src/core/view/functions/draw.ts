import { getContext } from '../../canvas/canvas';
import type { DeepPartial } from '../../types';
import type { View } from '../types';

export const draw = (
  view: View,
  updateView: (props?: DeepPartial<View>) => void
) => {
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
    if (view.imageUrl) {
      const img = new Image();
      img.src = view.imageUrl;
      ctx.drawImage(img, x, y, w, h);
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

  const updateTextSize = () => {
    if (
      !view.text.offset ||
      view.text.offset === 'center' ||
      !('x' in view.text.offset) ||
      !('y' in view.text.offset)
    ) {
      // update size prop based on rendered text size
      // not used by this renderer, but is helpful for referencing from other views
      const metrics = ctx.measureText(view.text.text.toString());
      const actualWidth = metrics.width;
      const actualHeight =
        metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent;
      if (!view.text.height || !view.text.width) {
        updateView({
          text: {
            width: actualWidth,
            height: actualHeight,
          },
        });
      }
      if (view.text.offset === 'center') {
        updateView({
          text: {
            offset: {
              x: -actualWidth / 2,
              y: actualHeight / 2,
            },
          },
        });
      } else {
        updateView({
          text: {
            offset: {
              x: 0,
              y: actualHeight * 4,
            },
          },
        });
      }
      return {
        width: actualWidth,
        height: actualHeight,
      };
    }
  };

  const drawText = () => {
    if (view.text.text) {
      const textSize = updateTextSize() || { width: 0, height: 0 };

      ctx.fillStyle = view.text.style.fill.color;
      ctx.strokeStyle = view.text.style.stroke.color;
      ctx.lineWidth = view.text.style.stroke.width * view.scale;
      ctx.font = `${view.text.fontWeight} ${view.text.fontStyle} ${
        view.text.fontSize * view.scale
      }px ${view.text.fontFamily}`;

      const tPos = () => {
        if (view.text.offset === 'center') {
          const finalOffset = {
            x: x + w / 2 - (textSize?.width ?? 0) / 2,
            y: y + h / 1.275,
          };
          return {
            x: x + finalOffset.x + w,
            y: y + finalOffset.y + h,
          };
        }

        return {
          x: x + w / 2 + (view.text.offset?.x ?? 0),
          y: y + h / 2 + (view.text.offset?.y ?? 0),
        };
      };
      const finalTextPos = tPos();

      ctx.globalAlpha = view.text.style.fill.opacity;
      ctx.fillText(view.text.text.toString(), finalTextPos.x, finalTextPos.y);

      ctx.globalAlpha = view.text.style.stroke.opacity;
      ctx.strokeText(view.text.text.toString(), finalTextPos.x, finalTextPos.y);
    }
  };

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
