import type { EntityViewInstance } from '../../entity/entityView';
import type { ViewInstance } from '../../view';

export const addHealthOpacityStyle = (view: ViewInstance) => {
  view.events.addEvent('update', () => {
    const percentHealth = view.model.health / view.model.maxHealth;
    const opacity = Math.max(0, percentHealth) ?? 0;

    view.updateGeometryStyle({
      fill: {
        opacity,
      },
    });
  });

  return view;
};
