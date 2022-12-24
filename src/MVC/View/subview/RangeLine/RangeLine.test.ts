/**
 * @jest-environment jsdom
 */

import { rotation } from '../../../../Types/Constants';
import { Options } from '../../../../Types/Interfaces'
import Observer from '../../../../Utils/Observer';
import Handle from '../Handle/Handle';
import RangeLine from './RangeLine';


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


describe('RangeLine test', () => {
  const appElement = document.createElement('div')
  const sliderElement = document.createElement('div')

  const observer = new Observer()
  const handle = new Handle(options, observer)
  const rangeLine = new RangeLine(options, handle)
  handle.render(appElement, 300)
  
  test('render method', () => {
    const render = jest.spyOn(rangeLine, 'render');
    const rangeLineElement = rangeLine.rangeLineElement
    rangeLine.render(sliderElement)

    expect(render).toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);

    expect([...sliderElement.children].includes(rangeLineElement)).toBe(true)
    expect(rangeLineElement.style.display).toBeDefined();
    expect([...rangeLineElement.classList].includes('slider-range')).toBe(true)
  });


  test('init method', () => {
    const updateStyle = jest.spyOn(RangeLine.prototype as any, '_updateStyle');
    const update = jest.spyOn(rangeLine, 'update');
    rangeLine.init(60, 210);

    expect(updateStyle).toHaveBeenCalled();
    expect(updateStyle).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
  });


  test('update and setOptions methods', () => {
    rangeLine.setOptions(options, 100, 200)
    const rangeLineElement = rangeLine.rangeLineElement
    expect(rangeLineElement.style.height).toBe('100px')
    expect(rangeLineElement.style.bottom).toBe('100px')
      
    const changbleOptions : Options = {...options, range: false}
    rangeLine.setOptions(changbleOptions, 100, 200)
    expect(rangeLineElement.style.height).toBe('100px')
    expect(rangeLineElement.style.bottom).toBe('0px')
  });
})