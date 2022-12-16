import { Options } from './../../Types/Interfaces'
import { rotation } from './../../Types/Constants'
import Model from './Model'

const options_isRange: Options = {
  min_value: 50,
  max_value: 150,
  values: [70, 130],
  separator: '',
  modifier: '',
  range: true,
  orientation: rotation.VERTICAL,
  label: false,
  step: 1,
  marks: []
}

const options_isUnrange: Options = {
  min_value: 50,
  max_value: 150,
  values: [100],
  separator: '',
  modifier: '',
  range: false,
  orientation: rotation.VERTICAL,
  label: false,
  step: 1,
  marks: []
}

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
}



describe('Model test with initial options', () => {

  test('Init invalid values', () => {
    const invalidOptions = { ...options_isUnrange }
    // @ts-ignore
    invalidOptions.values = ['qwerty']
    const model = new Model(invalidOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions).toEqual(defaultOptions)
  })

  test('Init uncorrect minMax value', () => {
    const uncorrectOptions = { ...options_isUnrange }
    uncorrectOptions.max_value = 100
    uncorrectOptions.min_value = 500
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.max_value).toBe(500)
    expect(validatedOptions.min_value).toBe(100)
  })

  //  isUnrange
  test('Init correct options (unRange)', () => {
    const model = new Model(options_isUnrange);
    const validatedOptions = model.getOptions()
    expect(validatedOptions).toEqual(options_isUnrange)
  })

  test('Init greater started value (unRange)', () => {
    const uncorrectOptions = { ...options_isUnrange }
    uncorrectOptions.values = [200]
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(50)
  })

  test('Init lower started value (unRange)', () => {
    const uncorrectOptions = { ...options_isUnrange }
    uncorrectOptions.values = [0]
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(50)
  })

  // isRange
  test('Init correct options (range)', () => {
    const model = new Model(options_isRange);
    const validatedOptions = model.getOptions()
    expect(validatedOptions).toEqual(options_isRange)
  })

  test('Init greater started value (range)', () => {
    const uncorrectOptions = { ...options_isRange }
    uncorrectOptions.values = [170, 180]
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(50)
    expect(validatedOptions.values[1]).toBe(150)
  })

  test('Init lower started value (range)', () => {
    const uncorrectOptions = { ...options_isRange }
    uncorrectOptions.values = [30, 40]
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(50)
    expect(validatedOptions.values[1]).toBe(150)
  })

  test('Init uncorrect step', () => {
    const uncorrectOptions = { ...options_isRange }
    uncorrectOptions.step = -5
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.step).toBe(10)
  })

  test('Init uncorrect marks', () => {
    const uncorrectOptions = { ...options_isRange }
    // @ts-ignore
    uncorrectOptions.marks = ''
    const model = new Model(uncorrectOptions);
    const validatedOptions = model.getOptions()
    expect(validatedOptions.marks.length).toBe(2)
  })
})

describe('Model test with seteble options', () => {

  test('Set correct options ', () => {
    const model = new Model(options_isUnrange);
    model.setOption(defaultOptions)
    const validatedOptions = model.getOptions()
    expect(validatedOptions).toEqual(defaultOptions)
  })

  test('Set uncorrect value', () => {
    const model = new Model(options_isUnrange);
    model.setOption({ min_value: 100, max_value: 200, values: [300] } as Options)
    const validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(200)
  })

  test('Set range', () => {
    const model = new Model(options_isUnrange);
    model.setOption({ range: true } as Options)
    let validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(100)
    expect(validatedOptions.values[1]).toBe(150)

    model.setOption({ range: false } as Options)
    validatedOptions = model.getOptions()
    expect(validatedOptions.values[0]).toBe(100)
  })
})