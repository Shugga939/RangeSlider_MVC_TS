import { Options } from './../../Types/Interfaces'
import { rotation } from './../../Types/Constants'

class Model {
  options: Options

  constructor(options: Options) {
    this.options = {} as Options
    this._initOptions(options)
  }

  getOptions(): Options {
    return this.options
  }

  setOption(options: Options) {
    const changebleOptions = options
    this._validationOfSetebleOptions(changebleOptions)
    this.options = { ...this.options, ...changebleOptions }
  }

  private _initOptions(options: Options) {
    const changebleOptions = options
    this._validationOfInitialOptions(changebleOptions)
  }

  private _initDefoultOptions() {
    this.options = {
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
    };
  }

  private _validationOfSetebleOptions(setebleOptions: Options) {   // исключения при установке опций на "лету"
    const secondValueIsSeteble =  setebleOptions?.values?.length == 2
    const secondValueIsExists =  this.options?.values?.length == 2

    if (setebleOptions.range && !secondValueIsSeteble && !secondValueIsExists) {
      this.options.values[1] = this.options.max_value
    }
  }
    
  private _validationOfInitialOptions(options: Options) {
    try {
      const changebleOptions = options
      this._validationOfValues(changebleOptions)   // min, max, [val1, val2]
      this._validationOfStep(changebleOptions)
      this._validationOfMarks(changebleOptions)
      this.options = changebleOptions
    } catch (e) {
      this._initDefoultOptions()
      console.log(new Error(`Укажите корректные значения в объекте: ${e}`))
    }
  }

  private _validationOfValues(options: Options): void {
    let { min_value, max_value, values: [val1, val2] } = options

    if (!min_value && !max_value || min_value == max_value) {
      throw 'Максимальное и/или минимальное значение'
    }

    if (!Number(val1) && Number(val1) != 0) {
      throw 'Первое значение'
    }

    if (min_value > max_value) {
      options.max_value = min_value
      options.min_value = max_value
    }

    if ((val2) && val1 > val2) {
      options.values = [val2, val1];
    }

    if (val1 < min_value || val1 > max_value) {
      options.values[0] = min_value;
      val1 = min_value
    }

    if (val2 && (val2 < min_value || val2 > max_value)) options.values = [val1, max_value];
  }

  private _validationOfStep(options: Options): void {
    const { step, min_value, max_value } = options
    if (step && (isNaN(options.step) || step <= 0)) options.step = (max_value - min_value) / 10
  }

  private _validationOfMarks(options: Options): void {
    if (Array.isArray(options.marks)) {
      options.marks = options.marks.filter(element =>
        element.value <= options.max_value && element.value >= options.min_value
      )
    } else {
      options.marks = []
      throw 'Массив с "марками'
    }
  }
}

export default Model