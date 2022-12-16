import { rotation } from '../../Types/Constants';
import { Options } from '../../Types/Interfaces';

import Model from '../Model/Model';
import View from '../View/View';
import Controller from './Controller'

const defaultOptions: Options = {
  min_value: 0,
  max_value: 100,
  values: [30, 60],
  separator: ' - ',
  modifier: '',
  range: true,
  orientation: rotation.VERTICAL,
  label: false,
  step: 0,
  marks: [
    {
      value: 0,
      label: `${0}`
    },
    {
      value: 100,
      label: `${100}`
    }]
};


afterEach(() => {
  jest.restoreAllMocks();
});

describe('Controller test', () => {
  const sliderElem: HTMLDivElement = document.createElement('div');
  expect(sliderElem.style.position).toBeDefined();

  const model = new Model(defaultOptions)
  const view = new View(sliderElem)
  const controller = new Controller(model, view);

  test('Init components', () => {
    const init = jest.spyOn(View.prototype as any, 'init');

    expect(init).toHaveBeenCalled();
    expect(init).toHaveBeenCalledTimes(1);

  });
  
  test('getValue method', () => {
    const value = controller.getValue();
    expect(value).toEqual(defaultOptions.values);
  });
})