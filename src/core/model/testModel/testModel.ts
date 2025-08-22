import { createModel } from '../model';

type TestModelData = {
  name: string;
  health: number;
  position: {
    x: number;
    y: number;
  };
  speed: number;
};

const testData: TestModelData = {
  name: 'test',
  health: 100,
  position: {
    x: 100,
    y: 100,
  },
  speed: 10,
};

export const testModel = createModel<TestModelData>(testData);
export type TestModel = typeof testModel;
