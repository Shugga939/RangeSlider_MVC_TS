import Slider from './subview/Slider'
import Input from './subview/Input'
import Handle from './subview/Handle'
import RangeLine from './subview/RangeLine'
import Observer from './../../Utils/Observer'
import {parseValueInPx, parsePxInValue} from "./../../Utils/Helpers"
import { Options } from '../../Types/Interfaces'
import { rotation } from '../../Types/Constants'

class View {
  options: Options
  app: HTMLDivElement
  observer: Observer
  slider_object: Slider
  handle: Handle
  rangeLine: RangeLine
  input: Input
  slider: HTMLDivElement
  first_value: number
  second_value: number
  size_slider: number

  constructor (element : HTMLDivElement) {
    if (!element.classList.contains('slider')) {
      this.app = document.createElement('div')
      this.app.classList.add('slider')
      element.append(this.app)
    } else {
      this.app = element
    }
    this.observer = new Observer()
  }

  getCurrentValues() : [number,number|undefined] {
    return [
      parsePxInValue(this.first_value,this.options, this.size_slider),
      parsePxInValue(this.second_value,this.options, this.size_slider)
    ]
  }

  update(options: Options) :void {
    this.options = options
    this.initValues()
    this.initStyles()
    this.slider_object.setOptions(options)
    this.handle.setOptions(options, this.first_value, this.second_value)
    this.rangeLine.setOptions(options)
    this.input.setOptions(options)
    this.handle.update_handle(this.handle.getHandle1(), this.first_value)
    this.handle.update_handle(this.handle.getHandle2(), this.second_value)
  }
  
  renderDOM (options: Options) :void {
    this.options = options
    this.slider_object = new Slider (this.options, this.app,this.observer)
    this.slider = this.slider_object.getDOM_element()
    this.input = new Input (this.options, this.app)
    this.handle = new Handle (this.options,this.slider_object,this.observer)
    this.rangeLine = new RangeLine (this.options, this.slider)
    this.input.renderInput()
    this.handle.renderHandles()
    this.rangeLine.renderLine()
    this.slider_object.renderSlider(this.handle)
  }
  
  initValues() :void {
    let isVertical = (this.options.orientation === rotation.VERTICAL)
    this.size_slider = isVertical? this.slider.getBoundingClientRect().height : 
                                   this.slider.getBoundingClientRect().width
    this.first_value = parseValueInPx (this.options.values[0], this.options, this.size_slider)
    this.second_value = parseValueInPx (this.options.values[1]!, this.options, this.size_slider)
  }

  initStyles () :void {
    this.handle.updateStyle()
    this.rangeLine.updateStyle(this.handle.getHandle1())
  }

  initScripts () :void {
    const that = this
    addListeners()
    addObserver()

    function addListeners() :void {
      that.handle.addListener()
      that.slider_object.addListener(that.first_value,that.second_value,that.handle)
      that.input.addListener(that.handle,that.size_slider)
      that.handle.update_handle(that.handle.getHandle1(),that.first_value)
      that.handle.update_handle(that.handle.getHandle2(),that.second_value)
      that.rangeLine.update(that.first_value,that.second_value)
      that.input.update(that.first_value,that.second_value,that.size_slider)
    }

    function addObserver () :void {
      that.observer.subscribe(updateValue)

      function updateValue (val1: number, val2: number) :void {
          that.first_value = val1
          that.second_value = val2
          that.rangeLine.update(that.first_value,that.second_value)
          that.input.update(that.first_value,that.second_value,that.size_slider)
          that.slider_object.update(that.first_value,that.second_value)
      }
    }
  }
}

export default View