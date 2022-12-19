/**
 * @jest-environment jsdom
 */

import { rotation } from '../../Types/Constants';
import { Options } from '../../Types/Interfaces';

import Model from '../Model/Model';
import View from '../View/View';
import Controller from './Controller'

const options: Options = {
  min_value: 0,
  max_value: 100,
  values: [20, 70],
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
  const model = new Model(options)
  const view = new View(sliderElem)

    // @ts-ignore
  window.HTMLElement.prototype.getBoundingClientRect = () => {
    return {
      width: 5,
      height: 300,
    };
  };
  
  test('Init components method', () => {
    const init = jest.spyOn(view, 'init');
    new Controller(model, view);
    expect(init).toHaveBeenCalled();
    expect(init).toHaveBeenCalledTimes(1);
  });
  
  test('getValue method', () => {
    const controller = new Controller(model, view);
    const value = controller.getValue();
    expect(value).toEqual(options.values);
  });

  test('setOptions method', () => {
    const controller = new Controller(model, view);
    const viewSetOption = jest.spyOn(view, 'setOption');
    const modelSetOption = jest.spyOn(model, 'setOption');
    
    const changbleOptions : Options = {...options, values: [30,90]}
    controller.setOptions(changbleOptions)

    expect(modelSetOption).toHaveBeenCalled();
    expect(modelSetOption).toBeCalledTimes(1)
    expect(modelSetOption).toHaveBeenLastCalledWith(changbleOptions)

    expect(viewSetOption).toHaveBeenCalled();
    expect(viewSetOption).toBeCalledTimes(1)
    expect(viewSetOption).toHaveBeenLastCalledWith(changbleOptions)

    const newOptions = model.getOptions()
    expect(newOptions.values).toEqual(changbleOptions.values)
  })
})