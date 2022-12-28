/**
 * @jest-environment jsdom
 */

import { rotation } from '../../../../Types/Constants';
import { Options } from '../../../../Types/Interfaces'
import Observer from '../../../../Utils/Observer';
import Handle from '../Handle/Handle';
import Labels from '../Labels/Labels';

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
    }]
};


afterEach(() => {
  jest.restoreAllMocks();
});


describe('Handle test', () => {
  const sliderElement = document.createElement('div')
  const size_slider = 300

  const observer = new Observer()
  const handle = new Handle(options, observer)

  const handle_1 = handle.getHandle1()
  const handle_2 = handle.getHandle2()

  handle_1.style.marginTop = '0px'
  handle_2.style.marginTop = '0px'

  
  test('render method', () => {
    const renderLables = jest.spyOn(handle.lables, 'render');
    handle.render(sliderElement, size_slider)

    
    expect([...sliderElement.children].includes(handle_1)).toBe(true)
    expect([...sliderElement.children].includes(handle_2)).toBe(true)
    
    expect(handle_1.style.display).toBeDefined();
    expect(handle_2.style.display).toBeDefined();
    
    expect([...handle_1.classList].includes('slider-handle')).toBe(true)
    expect([...handle_2.classList].includes('slider-handle')).toBe(true)
    
    expect(renderLables).toHaveBeenCalled();
    expect(renderLables).toHaveBeenCalledTimes(1);
  });

  test('init method', () => {
    const _addListener = jest.spyOn(Handle.prototype as any, '_addListener')
    const _initStyle = jest.spyOn(Handle.prototype as any, '_initStyle')
    const update = jest.spyOn(handle, 'update')

    handle.init(100, 200)

    expect(_addListener).toHaveBeenCalled();
    expect(_addListener).toHaveBeenCalledTimes(1);

    expect(_initStyle).toHaveBeenCalled();
    expect(_initStyle).toHaveBeenCalledTimes(1);

    expect(update).toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(2);
  });

  test('update method', () => {
    const labelsUpdate = jest.spyOn(handle.lables, 'update')
    handle.update(handle_1, size_slider)

    expect(handle_1.style.bottom).toBe(`${size_slider}px`)
    expect(labelsUpdate).toHaveBeenCalled();
    expect(labelsUpdate).toHaveBeenCalledTimes(1);
  });

  test('broadcast method', () => {
    const observerBroadcast = jest.spyOn(observer, 'broadcast')
    handle.broadcast(handle_1, size_slider)

    expect(handle.values[0]).toBe(size_slider)
    expect(observerBroadcast).toHaveBeenCalled();
    expect(observerBroadcast).toHaveBeenCalledTimes(1);
  });

  test('updateSize method', () => {
    const broadcast = jest.spyOn(handle, 'broadcast')
    handle.updateSize(size_slider+100, [20,70])
    
    expect(broadcast).toHaveBeenCalled();
    expect(broadcast).toHaveBeenCalledTimes(2);
    handle.updateSize(size_slider, [20,70])
  });

  test('setOptions method', () => {
    const handleInitStyle = jest.spyOn(Handle.prototype as any, '_initStyle')
    const handleAddListener = jest.spyOn(Handle.prototype as any, '_addListener')

    const labelRemove = jest.spyOn(handle.lables, 'delete')
    const setOptionsLabel = jest.spyOn(handle.lables, 'setOptions')
    const renderLabel = jest.spyOn(handle.lables, 'render')

    const newOptions : Options = {...options, range: false, label: false }

    handle.setOptions(newOptions, 100, 200)
    expect([...sliderElement.children].includes(handle_2)).toBe(false)
    expect(labelRemove).toHaveBeenCalled();
    expect(labelRemove).toHaveBeenCalledTimes(1);

    handle.setOptions(options, 100, 200)
    expect([...sliderElement.children].includes(handle_2)).toBe(true)
    expect(handleInitStyle).toHaveBeenCalled();
    expect(handleInitStyle).toHaveBeenCalledTimes(1);
    expect(handleAddListener).toHaveBeenCalled();
    expect(handleAddListener).toHaveBeenCalledTimes(1);

    expect(setOptionsLabel).toHaveBeenCalled();
    expect(setOptionsLabel).toHaveBeenCalledTimes(1);
    expect(renderLabel).toHaveBeenCalled();
    expect(renderLabel).toHaveBeenCalledTimes(1);
  });

  test('move handle without step', () => {
    const target_1 = 190
    const target_2 = 130
    const eventMouseDown = new MouseEvent('mousedown', {bubbles: true})
    const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
    let eventMouseMove = new MouseEvent('mousemove', {clientY: target_1})
    
    handle_1.dispatchEvent(eventMouseDown)
    document.dispatchEvent(eventMouseMove)
    document.dispatchEvent(eventMouseUp)
    expect(handle.values[0]).toBe(size_slider - target_1)

    eventMouseMove = new MouseEvent('mousemove', {clientY: target_2})
    handle_2.dispatchEvent(eventMouseDown)
    document.dispatchEvent(eventMouseMove)
    document.dispatchEvent(eventMouseUp)
    expect(handle.values[1]).toBe(size_slider - target_2)
  });

  test('move handle with step', () => {
    const step = 10
    const newOptions : Options = {...options, step: step, orientation: rotation.HORIZONTAL }
    handle.setOptions(newOptions, 90, 180)
    
    const target_1 = 55
    const target_2 = 215

    const eventMouseDown = new MouseEvent('mousedown', {bubbles: true})
    const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
    let eventMouseMove = new MouseEvent('mousemove', {clientX: target_1})

    handle_1.dispatchEvent(eventMouseDown)
    document.dispatchEvent(eventMouseMove)
    document.dispatchEvent(eventMouseUp)
    expect(handle.values[0]).toBe(60)

    eventMouseMove = new MouseEvent('mousemove', {clientX: target_2})
    handle_2.dispatchEvent(eventMouseDown)
    document.dispatchEvent(eventMouseMove)
    handle_2.dispatchEvent(eventMouseUp)
    expect(handle.values[1]).toBe(210)
  });
})





























// test('move handle without step', () => {
//   const sliderElement = document.createElement('div')
//   const size_slider = 300

//   const observer = new Observer()
//   const handle = new Handle(options, observer)

//   const handle_1 = handle.getHandle1()
//   const handle_2 = handle.getHandle2()

//   handle_1.style.marginTop = '0px'
//   handle_2.style.marginTop = '0px'

//   handle.render(sliderElement, size_slider)
//   handle.init(100, 200)

//   const target_1 = 190
//   const target_2 = 290
//   const eventMouseDown = new MouseEvent('mousedown', {bubbles: true})
//   const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
//   let eventMouseMove = new MouseEvent('mousemove', {clientY: target_1})

//   handle_1.dispatchEvent(eventMouseDown)
//   document.dispatchEvent(eventMouseMove)
//   document.dispatchEvent(eventMouseUp)
//   expect(handle.values[0]).toBe(size_slider - target_1)

//   eventMouseMove = new MouseEvent('mousemove', {clientY: target_2})
//   handle_2.dispatchEvent(eventMouseDown)
//   document.dispatchEvent(eventMouseMove)
//   document.dispatchEvent(eventMouseUp)
//   expect(handle.values[1]).toBe(size_slider - target_2)
// });

// test('move handle with step', () => {
//   const sliderElement = document.createElement('div')
//   const size_slider = 300
//   const step = 10

//   const observer = new Observer()
//   const handle = new Handle({...options, step: step, orientation: rotation.HORIZONTAL }, observer)

//   const handle_1 = handle.getHandle1()
//   const handle_2 = handle.getHandle2()

//   handle_1.style.marginTop = '0px'
//   handle_2.style.marginTop = '0px'

//   handle.render(sliderElement, size_slider)
//   handle.init(90, 180)
  
//   const target_1 = 55
//   const target_2 = 205

//   const eventMouseDown = new MouseEvent('mousedown', {bubbles: true})
//   const eventMouseUp = new MouseEvent('mouseup', {bubbles: true})
//   let eventMouseMove = new MouseEvent('mousemove', {clientX: target_1})

//   handle_1.dispatchEvent(eventMouseDown)
//   document.dispatchEvent(eventMouseMove)
//   document.dispatchEvent(eventMouseUp)
//   expect(handle.values[0]).toBe(60)

//   eventMouseMove = new MouseEvent('mousemove', {clientX: target_2})
//   handle_2.dispatchEvent(eventMouseDown)
//   document.dispatchEvent(eventMouseMove)
//   document.dispatchEvent(eventMouseUp)
//   expect(handle.values[1]).toBe(180)
// });