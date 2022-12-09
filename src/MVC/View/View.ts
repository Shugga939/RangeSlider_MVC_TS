import Slider from './subview/Slider'
import Input from './subview/Input'
import Observer from './../../Utils/Observer'
import { parseValueInPx, parsePxInValue } from "./../../Utils/Helpers"
import { Options } from '../../Types/Interfaces'
import { rotation } from '../../Types/Constants'

class View {
  parrentElement: HTMLDivElement
  options: Options
  app: HTMLDivElement
  observer: Observer
  slider: Slider
  input: Input
  slider_element: HTMLDivElement
  first_value: number   // in px
  second_value: number  // in px
  size_slider: number   // in px

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
  }

  setOption(options: Options): void {
    this.options = options
    this._initValues()
    this.slider.setOptions(options, this.first_value, this.second_value)
    this.input.setOptions(options)
  }

  _renderDOM(): void {
    if (this.parrentElement.classList.contains('slider')) {
      this.app = this.parrentElement
    } else {
      this.app = document.createElement('div')
      this.app.classList.add('slider')
      this.parrentElement.append(this.app)
    }
    this.slider = new Slider(this.options, this.app, this.observer)
    this.slider_element = this.slider.getDOM_element()
    this.input = new Input(this.options, this.app)
    this.slider.renderSlider()
    this.input.renderInput()
  }

  _initValues(): void {
    const isVertical = this.options.orientation === rotation.VERTICAL
    this.size_slider = isVertical ? 
      this.slider_element.getBoundingClientRect().height 
      :
      this.slider_element.getBoundingClientRect().width
    
    this.first_value = parseValueInPx(this.options.values[0], this.options, this.size_slider)
    this.second_value = parseValueInPx(this.options.values[1]!, this.options, this.size_slider)
  }

  private _initComponents(): void {
    this.slider.init(this.first_value, this.second_value)
    this.input.update(this.first_value, this.second_value, this.size_slider)
  }

  _addObserver(): void {
    const that = this
      this.observer.subscribe(updateValue)

      function updateValue(val1: number, val2: number): void {
        that.first_value = val1
        that.second_value = val2
        that.input.update(that.first_value, that.second_value, that.size_slider)
        that.slider.update(that.first_value, that.second_value)
    }
  }

  getCurrentValues(): [number, number | undefined] {
    return [
      parsePxInValue(this.first_value, this.options, this.size_slider),
      parsePxInValue(this.second_value, this.options, this.size_slider)
    ]
  }
}

export default View