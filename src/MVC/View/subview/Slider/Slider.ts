import { parsePxInValue, parseValueInPx } from '../../../../Utils/Helpers'
import Observer from '../../../../Utils/Observer'

import { rotation } from '../../../../Types/Constants'
import { Options } from '../../../../Types/Interfaces'

import Marks from '../Marks/Marks'
import Handle from '../Handle/Handle'
import RangeLine from '../RangeLine/RangeLine'

export default class Slider {
  private options: Options
  private observer: Observer
  private slider: HTMLDivElement
  private marks: Marks
  private handle: Handle
  private first_handle: HTMLSpanElement
  private second_handle: HTMLSpanElement
  private rangeLine: RangeLine
  private first_value: number     // in px
  private second_value: number    // in px
  private size_slider: number    // in px

  constructor(options: Options, observer: Observer) {
    this.options = options
    this.observer = observer
    this.slider = document.createElement('div')  
    this.handle = new Handle(this.options, this.observer)
    this.rangeLine = new RangeLine(this.options, this.handle)
    this.marks = new Marks(this.options, this.handle)
  }
  
  render(app: HTMLDivElement): void {
    this.slider.classList.add('range-slider')
    app.append(this.slider)
    this._setSliderWidth()
    this._renderComponents()
  }

  init(first_value: number, second_value: number) {
    this._setValues(first_value, second_value)
    this._initComponents(first_value, second_value)
    this._addListener()
  }

  setOptions(options: Options, first_value: number, second_value: number) {
    this.options = options
    this._setValues(first_value, second_value)
    this._setOptionsInComponents()
  }

  update(first_value: number, second_value: number) {
    this._setValues(first_value, second_value)
    this._updateComponents()
  }

  updateSize(size_slider: number, values: [number, number]) {
    this.size_slider = size_slider
    this.handle.updateSize(size_slider, values)
    this.marks.updateSize(size_slider)
  } 

  get sliderElement () {
    return this.slider
  }

  get handleComponent () {
    return this.handle
  }

  get sizeSlider () {
    return this.size_slider
  }

    //for tests
  get values() {
    return [this.first_value, this.second_value]
  }
    //for tests
  get sliderOptions() {
    return this.options
  }

  private _renderComponents() {
    this.handle.render(this.slider, this.size_slider)
    this.rangeLine.render(this.slider)
    this.marks.render(this.slider, this.size_slider)
  }

  private _initComponents(first_value: number, second_value: number) {
    this.handle.init(first_value, second_value)
    this.rangeLine.init(first_value, second_value)
    this.marks.init()
  }

  private _setValues(first_value: number, second_value: number) {
    this.first_value = first_value
    this.second_value = second_value 
  }

  private _setSliderWidth() {
    const isVertical = this.options.orientation === rotation.VERTICAL
    this.size_slider = isVertical ? 
      this.slider.getBoundingClientRect().height 
      :                                             
      this.slider.getBoundingClientRect().width
  }

  private _setOptionsInComponents() {
    this.handle.setOptions(this.options, this.first_value, this.second_value)
    this.rangeLine.setOptions(this.options, this.first_value, this.second_value)
    this.marks.setOptions(this.options)
  }

  private _updateComponents() {
    this.handle.update(this.first_handle, this.first_value)
    this.handle.update(this.second_handle, this.second_value)
    this.rangeLine.update(this.first_value, this.second_value)
  }

  private _addListener() {
    this.first_handle = this.handle.getHandle1()
    this.second_handle = this.handle.getHandle2()
    
    this.slider.addEventListener('mousedown', this._sliderMoveHandler.bind(this))
    this.slider.addEventListener('touchstart', this._sliderMoveHandler.bind(this))
  }
  
  private _sliderMoveHandler (event: TouchEvent | MouseEvent) {
    const that = this
    event.preventDefault()
    const isVertical = that.options.orientation === rotation.VERTICAL
    const isRange = that.options.range === true
    const {step} = that.options

    const clientX: number = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
    const clientY: number = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
    const { x, y } = that.slider.getBoundingClientRect()
    const targetIsHandle = event.target == that.first_handle && event.target == that.second_handle
    let target: number

    isVertical ? 
      target = -(clientY - y - that.size_slider) 
      :
      target = clientX - x
    
    if (!targetIsHandle) {
      if (that.marks) moveToMark()
      if (target < that.first_value) moveLeftHandle()
      if (target > that.first_value && !isRange) moveLeftHandle()
      if (target > that.first_value && target < that.second_value) moveBetweenHandle()
      if (target > that.second_value) moveRightHandle()
    }

    function moveToMark() {
      const marksElement = that.marks.marksElement
      const targetElement = event.target as HTMLElement
      if (targetElement.parentElement == marksElement) {
        let arrOfMarks = [...marksElement.children] as Array<HTMLElement>
        arrOfMarks.forEach((element) => {
          if (event.target == element) {
            target = parseValueInPx(Number(element.dataset.value), that.options, that.size_slider)
          }
        })
      }
    }

    function moveLeftHandle(): void {
      if (step) parseTargetToStep()
      if (parseInt(target.toFixed(1)) - 2 < 0) target = 0
      that.handle.broadcast(that.first_handle, target)
    }

    function moveBetweenHandle(): void {
      if (step) parseTargetToStep()
      if ((target - that.first_value) <= (that.second_value - target)) {
        that.handle.broadcast(that.first_handle, target)
      } else {
        that.handle.broadcast(that.second_handle, target)
      }
    }

    function moveRightHandle(): void {
      if (step) parseTargetToStep()
      if (parseInt(target.toFixed(1)) >= that.size_slider - 1) target = that.size_slider 
      if (isRange) {
        that.handle.broadcast(that.second_handle, target)
      } else {
        that.handle.broadcast(that.first_handle, target)
      }
    }

    function parseTargetToStep(): void {
      const { min_value, max_value } = that.options
      const step = that.options.step
      const value = (max_value - min_value) / step
      const val2 = step / value
      const val3 = parsePxInValue(target, that.options, that.size_slider) / value
      target = parseValueInPx(Math.round(val3 / val2) * step, that.options, that.size_slider)
    }
  }
}