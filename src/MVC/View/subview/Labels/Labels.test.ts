/**
 * @jest-environment jsdom
 */

import { rotation } from '../../../../Types/Constants';
import { Options } from '../../../../Types/Interfaces'
import Observer from '../../../../Utils/Observer';
import Handle from '../Handle/Handle';
import Labels from './Labels';


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


describe('Labels test', () => {
  const appElement = document.createElement('div')
  const observer = new Observer()
  const handle = new Handle(options, observer)
  const label = new Labels(options, handle)

  handle.render(appElement, 300)
  const handle_1 = handle.getHandle1()
  const handle_2 = handle.getHandle2()
  
  test('render method', () => {
    const render = jest.spyOn(label, 'render');
    label.render()
    const label_1 = label.labels[0]
    const label_2 = label.labels[1]

    expect(render).toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);

    expect([...handle_1.children].includes(label_1)).toBe(true)
    expect(label_1.style.display).toBeDefined();
    expect([...handle_2.children].includes(label_2)).toBe(true)
    expect(label_2.style.display).toBeDefined();

    label.labels.forEach((label)=> {
      expect([...label.classList]).toEqual(['value_label', 'label_vertical'])
    })

    label.setOptions({...options, orientation: rotation.HORIZONTAL})

    label.labels.forEach((label)=> {
      console.log([...label.classList]);
      
      expect([...label.classList]).toEqual(['value_label', 'label_horizontal'])
    })
  });

  test('delete method', () => {
    label.render()
    const label_1 = label.labels[0]
    const label_2 = label.labels[1]

    label.delete()
    expect([...handle_1.children].includes(label_1)).toBe(false)
    expect([...handle_2.children].includes(label_2)).toBe(false)
  })
  
  test('setOptions method', () => {
    const changbleOptions : Options = {...options, orientation: rotation.HORIZONTAL, range: false}
    
    label.setOptions(changbleOptions)
    const [isRange, isVertical] = label.getOptions()
    expect(isRange).toBe(false)
    expect(isVertical).toBe(false)
  });
})