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
  const labels = new Labels(options, handle)

  
  test('render method', () => {
    const renderLables = jest.spyOn(handle.lables, 'render');
    handle.render(sliderElement, size_slider)

    const handle_1 = handle.getHandle1()
    const handle_2 = handle.getHandle2()
    
    expect([...sliderElement.children].includes(handle_1)).toBe(true)
    expect([...sliderElement.children].includes(handle_2)).toBe(true)
    
    expect(handle_1.style.display).toBeDefined();
    expect(handle_2.style.display).toBeDefined();
    
    expect([...handle_1.classList].includes('slider-handle')).toBe(true)
    expect([...handle_2.classList].includes('slider-handle')).toBe(true)
    
    expect(renderLables).toHaveBeenCalled();
    expect(renderLables).toHaveBeenCalledTimes(1);
  });

  // test('delete method', () => {
  //   marks.delete()
  //   const marksElement = marks.marksElement
  //   const marksArray = marks.marksArray

  //   expect([...sliderElement.children].includes(marksElement)).toBe(false)
  //   expect(marksElement.style.display).toBe('');
  //   expect([...marksArray].length).toBe(0)
  // });

  // test('setOptions method', () => {
  //   const deleteFn = jest.spyOn(marks, 'delete');
  //   const newOptions : Options = {...options, marks: [
  //     {
  //       value: 0,
  //       label: `${0}`
  //     },
  //     {
  //       value: 50,
  //       label: `${50}`
  //     },
  //     {
  //       value: 100,
  //       label: `${100}`
  //     },
  //   ] }

  //   marks.setOptions(newOptions)
  //   expect(deleteFn).toHaveBeenCalled();
  //   expect(deleteFn).toHaveBeenCalledTimes(1);
  //   expect([...marks.marksArray].length).toBe(3)
  // });

  // test('updateSize method', () => {
  //   expect(marks.marksArray[0].style.bottom).toBe(`-${size_slider}px`)
  //   expect(marks.marksArray[1].style.bottom).toBe(`-${size_slider/2}px`)
  //   expect(marks.marksArray[2].style.bottom).toBe(`${0}px`)

  //   const newSizeSlider = 200
  //   marks.updateSize(200)

  //   expect(marks.marksArray[0].style.bottom).toBe(`-${newSizeSlider}px`)
  //   expect(marks.marksArray[1].style.bottom).toBe(`-${newSizeSlider/2}px`)
  //   expect(marks.marksArray[2].style.bottom).toBe(`${0}px`)
  // });
})