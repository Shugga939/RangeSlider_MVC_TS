/**
 * @jest-environment jsdom
 */

import { rotation } from '../../../../Types/Constants';
import { Options } from '../../../../Types/Interfaces'
import Observer from '../../../../Utils/Observer';
import Handle from '../Handle/Handle';
import Marks from '../Marks/Marks';
import RangeLine from '../RangeLine/RangeLine';
import Slider from './Slider';

const options: Options = {
  min_value: 0,
  max_value: 100,
  values: [20, 70],
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
  const size_slider = 300

  const observer = new Observer()
  const slider = new Slider(options, observer)
  const sliderElement = slider.sliderElement
  const handleComponent = slider.handleComponent
  const handle_1 = handleComponent.getHandle1()
  const handle_2 = handleComponent.getHandle2()

    // @ts-ignore
  sliderElement.getBoundingClientRect = () => ({height: size_slider, y: 0})

  test('render method', () => {
    const renderHandle = jest.spyOn(Handle.prototype as any, 'render');
    const renderRangeLine = jest.spyOn(RangeLine.prototype as any, 'render');
    const renderMarks = jest.spyOn(Marks.prototype, 'render');
    const _setSliderWidth = jest.spyOn(Slider.prototype as any, '_setSliderWidth');

    slider.render(appElement)

    expect([...appElement.children].includes(sliderElement)).toBe(true)
    expect(sliderElement.style.display).toBeDefined();
    expect([...sliderElement.classList].includes('range-slider')).toBe(true)
    
    expect(renderHandle).toHaveBeenCalled();
    expect(renderHandle).toHaveBeenCalledTimes(1);
    expect(renderRangeLine).toHaveBeenCalled();
    expect(renderRangeLine).toHaveBeenCalledTimes(1);
    expect(renderMarks).toHaveBeenCalled();
    expect(renderMarks).toHaveBeenCalledTimes(1);
    expect(_setSliderWidth).toHaveBeenCalled();

    expect(slider.sizeSlider).toBe(size_slider)
  });

  test('init method', () => {
    const _addListener = jest.spyOn(Slider.prototype as any, '_addListener')
    const _initComponents = jest.spyOn(Slider.prototype as any, '_initComponents')
    const _setValues = jest.spyOn(Slider.prototype as any, '_setValues')

    slider.init(100, 200)

    expect(_addListener).toHaveBeenCalled();
    expect(_addListener).toHaveBeenCalledTimes(1);

    expect(_initComponents).toHaveBeenCalled();
    expect(_initComponents).toHaveBeenCalledTimes(1);

    expect(_setValues).toHaveBeenCalled();
    expect(_setValues).toHaveBeenCalledTimes(1);

    expect(slider.values).toEqual([100, 200]);
  });

  test('setOptions and _setValues methods', () => {
    const _setValues = jest.spyOn(Slider.prototype as any, '_setValues')
    const _setOptionsInComponents = jest.spyOn(Slider.prototype as any, '_setOptionsInComponents')

    const newOptions : Options = {...options, range: false, label: false }

    slider.setOptions(newOptions, 100, 200)
    expect(slider.sliderOptions).toEqual(newOptions);

    expect(_setValues).toHaveBeenCalled();
    expect(_setValues).toHaveBeenCalledTimes(1);
    expect(_setOptionsInComponents).toHaveBeenCalled();
    expect(_setOptionsInComponents).toHaveBeenCalledTimes(1);

    slider.setOptions(options, 100, 200)
    expect(slider.sliderOptions).toEqual(options);
  });

  test('update method', () => {
    const _setValues = jest.spyOn(Slider.prototype as any, '_setValues')
    const _updateComponents = jest.spyOn(Slider.prototype as any, '_updateComponents')

    slider.update(150, 250)
    slider.update(100, 200)
    expect(_setValues).toHaveBeenCalled();
    expect(_setValues).toHaveBeenCalledTimes(2);
    expect(_updateComponents).toHaveBeenCalled();
    expect(_updateComponents).toHaveBeenCalledTimes(2);
  });

  test('updateSize method', () => {
    const updateSizeHandle = jest.spyOn(Handle.prototype as any, 'updateSize')
    const updateSizeMarks = jest.spyOn(Marks.prototype as any, 'updateSize')

    slider.updateSize(250, [80, 170])
    expect(slider.sizeSlider).toBe(250)
    expect(updateSizeHandle).toHaveBeenCalled();
    expect(updateSizeHandle).toHaveBeenCalledTimes(1);
    expect(updateSizeMarks).toHaveBeenCalled();
    expect(updateSizeMarks).toHaveBeenCalledTimes(1);

    slider.updateSize(size_slider, [100, 200])
  });

  test('move slider without step', () => {
    const broadcastHandle = jest.spyOn(handleComponent, 'broadcast')
    const target_1 = 50
    const target_2 = 250
    const target_3 = 180

    let eventMouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      clientY: target_1,
    })
    const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
    
    sliderElement.dispatchEvent(eventMouseDown)
    sliderElement.dispatchEvent(eventMouseUp)
    expect(broadcastHandle).toHaveBeenCalled();
    expect(broadcastHandle).toHaveBeenCalledTimes(1);
    expect(broadcastHandle).toHaveBeenLastCalledWith(handle_2, size_slider - target_1);

    eventMouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      clientY: target_2,
    })
    sliderElement.dispatchEvent(eventMouseDown)
    sliderElement.dispatchEvent(eventMouseUp)
    expect(broadcastHandle).toHaveBeenCalledTimes(2);
    expect(broadcastHandle).toHaveBeenLastCalledWith(handle_1, size_slider - target_2);

    eventMouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      clientY: target_3,
    })
    sliderElement.dispatchEvent(eventMouseDown)
    sliderElement.dispatchEvent(eventMouseUp)
    expect(broadcastHandle).toHaveBeenCalledTimes(3);
    expect(broadcastHandle).toHaveBeenLastCalledWith(handle_1, size_slider - target_3);
  });


  test('move slider with step', () => {
    const newOptions : Options = {...options, step: 10 }
    slider.setOptions(newOptions, 100, 200)

    const broadcastHandle = jest.spyOn(handleComponent, 'broadcast')
    const target_1 = 50
    const target_2 = 185
    
    let eventMouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      clientY: target_1,
    })
    const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
    
    sliderElement.dispatchEvent(eventMouseDown)
    sliderElement.dispatchEvent(eventMouseUp)
    expect(broadcastHandle).toHaveBeenCalled();
    expect(broadcastHandle).toHaveBeenCalledTimes(1);
    expect(broadcastHandle).toHaveBeenLastCalledWith(handle_2, 240);

    eventMouseDown = new MouseEvent('mousedown', {
      bubbles: true,
      clientY: target_2,
    })
    sliderElement.dispatchEvent(eventMouseDown)
    sliderElement.dispatchEvent(eventMouseUp)
    expect(broadcastHandle).toHaveBeenCalledTimes(2);
    expect(broadcastHandle).toHaveBeenLastCalledWith(handle_1, 120);
  })
})
