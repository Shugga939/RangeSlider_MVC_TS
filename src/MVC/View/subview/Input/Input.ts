import { parseValueInPx } from '../../../../Utils/Helpers'
import { Options } from '../../../../Types/Interfaces'
import Handle from '../Handle/Handle'

export default class Input {
  private options: Options
  private handle: Handle
  private size_slider: number
  private first_handle: HTMLSpanElement
  private second_handle: HTMLSpanElement
  private input: HTMLInputElement

  constructor(options: Options) {
    this.options = options
  }

  render(app: HTMLDivElement): void {
    this.input = document.createElement('input')
    this.input.classList.add('slider-value')
    this.input.type = 'text'
    app.append(this.input)
  }

  init(handle: Handle, size_slider: number) {
    this.handle = handle
    this.size_slider = size_slider
    this.first_handle = handle.getHandle1()
    this.second_handle = handle.getHandle2()
    this._addListener()
  }

  setOptions(options: Options): void {
    this.options = options
    this.update(this.options.values[0], this.options.values[1]!)
  }

  update(first_value: number, second_value: number) {
    const { separator = '', modifier = '' } = this.options
    const isRange = this.options.range === true
    
    if (isRange) {
      this.input.value = first_value + modifier + separator + second_value + modifier
    } else {
      this.input.value = first_value + modifier
    }
  }

  get inputElement () {
    return this.input
  }

  private _addListener(): void {
    this.input.addEventListener('change', this._inputHandler.bind(this))
  }
  
  private _inputHandler() {
    const that = this
    const isRange = that.options.range === true
    const { separator = '', modifier = '' } = that.options
    const [value_1, value_2] = parseValue(that.input.value)
    
    broadcast()
    
    function broadcast() {
      that.handle.broadcast(that.first_handle, parseValueInPx(value_1, that.options, that.size_slider))
      if (isRange) {
        that.handle.broadcast(that.second_handle, parseValueInPx(value_2, that.options, that.size_slider))
        that.input.value = value_1 + modifier + separator + value_2 + modifier
      } else {
        that.input.value = value_1 + modifier
      }
    }

    function parseValue(value: string): [number, number] {
      const { min_value, max_value } = that.options
      let value_1 = parseInt(value)
      let value_2: number | undefined;

      if (separator && isRange) {
        value_1 = parseInt(value.split(separator)[0])
        value_2 = parseInt(value.split(separator)[1])
      } else if (modifier && isRange) {
        value_1 = parseInt(value.split(modifier)[0])
        value_2 = parseInt(value.split(modifier)[1])
      } else if (!isRange) {
        value_1 = parseInt(value)
      }

      if (isNaN(value_1)) value_1 = min_value

      if (isRange) {
        if (!value_2 || isNaN(value_2)) value_2 = max_value
        if (value_1 > value_2 || value_2 < value_1)  [value_1, value_2] = [value_2, value_1]
      }
      
      return [
        checkMinMax(value_1),
        checkMinMax(value_2)
      ]

      function checkMinMax(val: number | undefined): number {
        if (val && (val < min_value)) {
          return min_value
        } else if (val && (val > max_value)) {
          return max_value
        } else if (!val) {
          return min_value
        } else {
          return val
        }
      }
    }
  }
}