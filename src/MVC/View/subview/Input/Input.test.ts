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
    const render = jest.spyOn(input, 'render');
    input.render(appElement)
    const inputElement = input.inputElement

    expect(render).toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);
    expect([...appElement.children].includes(inputElement)).toBe(true)
    expect(inputElement.style.display).toBeDefined();
    expect(inputElement.type === 'text')
  });
  
  test('Init method', () => {
    const init = jest.spyOn(input, 'init');
    input.init(handle, size_slider)
    expect(init).toHaveBeenCalled();
    expect(init).toHaveBeenCalledTimes(1);
  });

  test('_addListener method', () => {
    const addListener = jest.spyOn(Input.prototype as any, '_addListener');
    const inputEvent = new InputEvent('change', {bubbles: true});

    input.init(handle, size_slider)
    expect(addListener).toHaveBeenCalled();
    expect(addListener).toHaveBeenCalledTimes(1);

    const inputElem = input.inputElement
    
    inputElem.value = '40 - 60'
    inputElem.dispatchEvent(inputEvent)
    let result = `${40 + options.modifier + options.separator + 60 + options.modifier}`
    expect(inputElem.value).toBe(result)

    inputElem.value = '80 - 20'
    inputElem.dispatchEvent(inputEvent)
    result = `${20 + options.modifier + options.separator + 80 + options.modifier}`
    expect(inputElem.value).toBe(result)

    inputElem.value = '-10 - 110'
    inputElem.dispatchEvent(inputEvent)
    result = `${0 + options.modifier + options.separator + 100 + options.modifier}`
    expect(inputElem.value).toBe(result)

    input.setOptions({...options, range: false} as Options)
    inputElem.value = '50'
    inputElem.dispatchEvent(inputEvent)
    result = `${50 + options.modifier}`
    expect(inputElem.value).toBe(result)
    input.setOptions({...options, range: true} as Options)
  });

  test('setOptions method', () => {
    const inputElement = input.inputElement
    const update = jest.spyOn(Input.prototype as any, 'update');
    let changbleOptions : Options = {...options, values: [30, 90]}
    let result = `${30 + options.modifier + options.separator + 90 + options.modifier}`
    
    input.setOptions(changbleOptions)
    expect(update).toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
    expect(inputElement.value).toBe(result)

    changbleOptions = {...options, values: [10], range: false}
    input.setOptions(changbleOptions)
    result = `${10 + options.modifier}`
    expect(inputElement.value).toBe(result)
  });
})