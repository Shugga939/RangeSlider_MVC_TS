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
  private parsedValues: Array<number>  // displayed value

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
    this.slider.setOptions(options, this.first_value, this.second_value)
    this.input.setOptions(options)
  }

  getCurrentValues(): Array<number> {
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
    this.slider.renderSlider(app)

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
    this.observer.subscribe(updateValue)

    function updateValue(val1: number, val2: number): void {
      that.first_value = val1
      that.second_value = val2
      that.parsedValues = [
        parsePxInValue(that.first_value, that.options, that.size_slider),
        parsePxInValue(that.second_value, that.options, that.size_slider)
      ]
      that.slider.update(that.first_value, that.second_value)
      that.input.update(that.parsedValues[0], that.parsedValues[1])
    }
  }

  private _addResizeListener(): void {
    const resizeHandler = ()=> {
      const isVertical = this.options.orientation === rotation.VERTICAL
      const sliderElement = this.slider.sliderElement

      const size_slider = isVertical ? 
        sliderElement.getBoundingClientRect().height 
        :
        sliderElement.getBoundingClientRect().width

      const v1 = parseValueInPx(this.parsedValues[0], this.options, size_slider)
      const v2 = parseValueInPx(this.parsedValues[1], this.options, size_slider)

      this.size_slider = size_slider
      this.slider.updateSize(this.size_slider, [v1,v2])
    }
    window.addEventListener('resize', resizeHandler)
  }
}

export default View