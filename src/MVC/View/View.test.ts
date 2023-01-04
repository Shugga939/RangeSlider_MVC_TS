/**
 * @jest-environment jsdom
 */

import { rotation } from '../../Types/Constants';
import { Options } from '../../Types/Interfaces'
import Slider from './subview/Slider/Slider';
import View from './View';

const options: Options = {
  min_value: 0,
  max_value: 100,
  values: [20, 60],
  separator: ' - ',
  modifier: '',
  range: true,
  orientation: rotation.VERTICAL,
  label: true,
  step: 0,
  marks: [
    {
      value: 0,
      label: `${0}`
    },
    {
      value: 100,
      label: `${100}`
    }
  ]
};


afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks()
});


describe('Slider test', () => {
  const appElement = document.createElement('div')
  appElement.classList.add('slider')
  const size_slider = 300
  const view = new View (appElement)
  const observer = view.viewObserver

  // @ts-ignore
  window.HTMLDivElement.prototype.getBoundingClientRect = () => ({height: size_slider})


  // const sliderElement = slider.sliderElement
  // const handleComponent = slider.handleComponent
  // const handle_1 = handleComponent.getHandle1()
  // const handle_2 = handleComponent.getHandle2()

    // @ts-ignore
  // sliderElement.getBoundingClientRect = () => ({height: size_slider, y: 0})

  test('init method', () => {
    const _renderDOM = jest.spyOn(View.prototype as any, '_renderDOM');
    const _initValues = jest.spyOn(View.prototype as any, '_initValues');
    const _initComponents = jest.spyOn(View.prototype as any, '_initComponents');
    const subscribe = jest.spyOn(view, 'subscribe');
    const _addResizeListener = jest.spyOn(View.prototype as any, '_addResizeListener');
    
    view.init(options) 
    const slider = view.sliderComponent
    const input = view.inputComponent
    
    expect([...appElement.children].includes(slider.sliderElement)).toBe(true)
    expect([...appElement.children].includes(input.inputElement)).toBe(true)
    expect(slider.sliderElement.style.display).toBeDefined();
    expect(input.inputElement.style.display).toBeDefined();

    expect(view.viewOptions).toEqual(options)
    expect(view.values).toEqual([60,180])
    expect(view.getCurrentValues()).toEqual(options.values)

    expect(_renderDOM).toHaveBeenCalled();
    expect(_renderDOM).toHaveBeenCalledTimes(1);
    expect(_initValues).toHaveBeenCalled();
    expect(_initValues).toHaveBeenCalledTimes(1);
    expect(_initComponents).toHaveBeenCalled();
    expect(_initComponents).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalled();
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(_addResizeListener).toHaveBeenCalled();
    expect(_addResizeListener).toHaveBeenCalledTimes(1);
  });

  test('setOptions method', () => {
    const _initValues = jest.spyOn(View.prototype as any, '_initValues');
    const _setOptionsInComponents = jest.spyOn(View.prototype as any, '_setOptionsInComponents');
    const newOptions : Options = {...options, values: [80, 90] }

    view.setOption(newOptions)
    expect(view.viewOptions).toEqual(newOptions)
    expect(view.values).toEqual([240,270])
    expect(view.getCurrentValues()).toEqual(newOptions.values)

    expect(_initValues).toHaveBeenCalled();
    expect(_initValues).toHaveBeenCalledTimes(1);
    expect(_setOptionsInComponents).toHaveBeenCalled();
    expect(_setOptionsInComponents).toHaveBeenCalledTimes(1);
  });

  test('resize method', () => {
    const slider = view.sliderComponent
    const oldValues = view.getCurrentValues()
    // @ts-ignore
    slider.sliderElement.getBoundingClientRect = () => ({height: 200, y: 0})
    const resizeEvent = new Event('resize')

    window.dispatchEvent(resizeEvent)
    expect(view.values).not.toEqual(oldValues)
    expect(view.values).toEqual([160,180])
  });
})
