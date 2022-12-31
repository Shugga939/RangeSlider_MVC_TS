import { parseValueInPx, parsePxInValue } from "./../../Utils/Helpers"
import Observer from './../../Utils/Observer'

import { Options } from '../../Types/Interfaces'
import { rotation } from '../../Types/Constants'

import Slider from './subview/Slider/Slider'
import Input from './subview/Input/Input'

class View {
  private parrentElement: HTMLDivElement
  private options: Options
  private observer: Observer
  private slider: Slider
  private input: Input
  private first_value: number   // in px
  private second_value: number  // in px
  private size_slider: number   // in px
  private parsedValues: [number, number]  // displayed value

  constructor(element: HTMLDivElement) {
    this.parrentElement = element
    this.observer = new Observer()
  }

  init(options: Options): void {
    this.options = options
    this._renderDOM()
    this._initValues()
    this._initComponents()
    this._addObserver()
    this._addResizeListener()
  }

  setOption(options: Options): void {
    this.options = options
    this._initValues()
    this._setOptionsInComponents()
  }

  getCurrentValues(): [number, number] {
    return this.parsedValues
  }

  private _renderDOM(): void {
    let app
    if (this.parrentElement.classList.contains('slider')) {
      app = this.parrentElement
    } else {
      app = document.createElement('div')
      app.classList.add('slider')
      this.parrentElement.append(app)
    }
    this.slider = new Slider(this.options, this.observer)
    this.slider.render(app)

    this.input = new Input(this.options)
    this.input.render(app)
  }

  private _initValues(): void {
    const isVertical = this.options.orientation === rotation.VERTICAL
    const sliderElement = this.slider.sliderElement

    this.size_slider = isVertical ?
      sliderElement.getBoundingClientRect().height
      :
      sliderElement.getBoundingClientRect().width

    this.first_value = parseValueInPx(this.options.values[0], this.options, this.size_slider)
    this.second_value = parseValueInPx(this.options.values[1]!, this.options, this.size_slider)
    this.parsedValues = [this.options.values[0], this.options.values[1]!]
  }

  private _initComponents(): void {
    this.slider.init(this.first_value, this.second_value)
    this.input.init(this.slider.handleComponent, this.size_slider)
    this.input.update(this.parsedValues[0], this.parsedValues[1])
  }

  private _addObserver(): void {
    const that = this
    this.observer.subscribe(updateApp)

    function updateApp(first_value: number, second_value: number): void {
      that._update(first_value, second_value)
      that._updateComponents()
    }
  }

  private _update(first_value: number, second_value: number): void {
    this.first_value = first_value
    this.second_value = second_value
    this.parsedValues = [
      parsePxInValue(this.first_value, this.options, this.size_slider),
      parsePxInValue(this.second_value, this.options, this.size_slider)
    ]
  }

  private _updateComponents(): void {
    this.slider.update(this.first_value, this.second_value)
    this.input.update(this.parsedValues[0], this.parsedValues[1])
  }

  private _setOptionsInComponents(): void {
    this.slider.setOptions(this.options, this.first_value, this.second_value)
    this.input.setOptions(this.options)
  }

  private _addResizeListener(): void {
    const resizeHandler = () => {
      const isVertical = this.options.orientation === rotation.VERTICAL
      const sliderElement = this.slider.sliderElement

      const size_slider = isVertical ?
        sliderElement.getBoundingClientRect().height
        :
        sliderElement.getBoundingClientRect().width

      const value_1 = parseValueInPx(this.parsedValues[0], this.options, size_slider)
      const value_2 = parseValueInPx(this.parsedValues[1], this.options, size_slider)

      this.size_slider = size_slider
      this.slider.updateSize(this.size_slider, [value_1, value_2])
    }
    window.addEventListener('resize', resizeHandler)
  }
}

export default View