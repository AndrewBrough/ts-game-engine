import type { EntityViewInstance } from '../player/entityView';

export const changeColorForHealth = (
  view: EntityViewInstance,
  event: string
) => {
  view.events.addEvent(event, () => {
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
