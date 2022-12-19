/**
 * @jest-environment jsdom
 */

import { rotation } from '../../../../Types/Constants';
import { Options } from '../../../../Types/Interfaces'
import Observer from '../../../../Utils/Observer';
import Handle from '../Handle/Handle';
import Input from './Input';


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


describe('Input test', () => {
  const appElement = document.createElement('div')
  const observer = new Observer()
  const handle = new Handle(options, observer)
  const input = new Input(options)
  const size_slider = 300
  
  test('Render method', () => {
    const init = jest.spyOn(input, 'renderInput');
    input.renderInput(appElement)
    const inputElement = input.input
    
    expect(init).toHaveBeenCalled();
    expect(init).toHaveBeenCalledTimes(1);
    expect([...appElement.children].includes(inputElement))
    expect(inputElement.style.display).toBeDefined();
    expect(inputElement.type === 'text')
  });
  
  // test('Init method', () => {
  //   const init = jest.spyOn(input, 'init');
  //   input.init(handle, size_slider)
  //   expect(init).toHaveBeenCalled();
  //   expect(init).toHaveBeenCalledTimes(1);

  // });
  
  // test('getValue method', () => {
  //   const controller = new Controller(model, view);
  //   const value = controller.getValue();
  //   expect(value).toEqual(options.values);
  // });

  // test('setOptions method', () => {
  //   const controller = new Controller(model, view);
  //   const viewSetOption = jest.spyOn(view, 'setOption');
  //   const modelSetOption = jest.spyOn(model, 'setOption');

  //   controller.setOptions(options)
  //   expect(modelSetOption).toHaveBeenCalled();
  //   expect(modelSetOption).toBeCalledTimes(1)
  //   expect(modelSetOption).toHaveBeenLastCalledWith(options)

  //   const changbleOptions = model.getOptions()
  //   expect(viewSetOption).toHaveBeenCalled();
  //   expect(viewSetOption).toBeCalledTimes(1)
  //   expect(viewSetOption).toHaveBeenLastCalledWith(changbleOptions)
  // })
})