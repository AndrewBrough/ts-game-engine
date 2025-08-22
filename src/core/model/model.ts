import type { Model } from './types';

/**
 * This should be a barebones model that can be used to create a view.
 * It should return an object that can be saved in a database or persistent storage somehow.
 * eg. {
 *  id: string;
 *  name: string;
 *  description: string;
 *  createdAt: Date;
 *  updatedAt: Date;
 * }
 *
 * eg. localstorage db tech https://www.npmjs.com/package/blastore
 *
 * this file should not return anything but a bare object with an id
 * and functionality to save it in the db.
 *
 * We should use this as a core to create other models for a game.
 *
 * usage example:
 *
 * const testModel = createModel({
 *  name: 'test',
 *  health: 100,
 *  position: {
 *      x: 100,
 *      y: 100,
 *  },
 *  speed: 10,
 * })
 *
 * console.log(testModel)
 */
export const createModel = <T extends object>(obj: T): Model & T => {
  const newModel = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    ...obj,
  };

  return newModel as typeof newModel;
};
