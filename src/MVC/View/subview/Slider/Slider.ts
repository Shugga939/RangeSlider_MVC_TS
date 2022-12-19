import { parsePxInValue, parseValueInPx } from '../../../../Utils/Helpers'
import Observer from '../../../../Utils/Observer'

import { rotation } from '../../../../Types/Constants'
import { Options } from '../../../../Types/Interfaces'

import Marks from '../Marks/Marks'
import Handle from '../Handle/Handle'
import RangeLine from '../RangeLine/RangeLine'

export default class Slider {
  options: Options
  observer: Observer
  slider: HTMLDivElement
  marks: Marks
  handle: Handle
  first_handle: HTMLSpanElement
  second_handle: HTMLSpanElement
  rangeLine: RangeLine
  first_value: number     // in px
  second_value: number    // in px
  size_slider: number    // in px

  constructor(options: Options, observer: Observer) {
    this.options = options
    this.observer = observer
    this.handle = new Handle(this.options, this.observer)
    this.rangeLine = new RangeLine(this.options, this.handle)
    this.marks = new Marks(this.options, this.handle)
  }
  
  renderSlider(app: HTMLDivElement): void {
    this.slider = document.createElement('div')  
    this.slider.classList.add('range-slider')
    app.append(this.slider)
    this._setSliderWidth()
    this.handle.render(this.slider, this.size_slider)
    this.rangeLine.render(this.slider)
    this.marks.render(this.slider, this.size_slider)
  }

  init(first_value: number, second_value: number) {
    this._setValues(first_value, second_value)
    this._initComponents(first_value, second_value)
    this._addListener()
  }

  private _initComponents(first_value: number, second_value: number) {
    this.handle.init(first_value, second_value)
    this.rangeLine.init(first_value, second_value)
    this.marks.init()
  }

  setOptions(options: Options, first_value: number, second_value: number) {
    this.options = options
    this._setValues(first_value, second_value)
    this.handle.setOptions(options, this.first_value, this.second_value)
    this.rangeLine.setOptions(options, this.first_value, this.second_value)
    this.marks.setOptions(this.options)
  }

  update(first_value: number, second_value: number) {
    this._setValues(first_value, second_value)
    this.handle.update(this.first_handle, first_value)
    this.handle.update(this.second_handle, second_value)
    this.rangeLine.update(this.first_value, this.second_value)
  }

  updateSize(size_slider: number, values: Array<number>) {
    this.size_slider = size_slider
    this.handle.updateSize(size_slider, values)
    this.marks.updateSize(size_slider)
  } 

  getDOM_element(): HTMLDivElement {
    return this.slider
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

  private _addListener() {
    const that = this
    this.first_handle = this.handle.getHandle1()
    this.second_handle = this.handle.getHandle2()
    
    this.slider.addEventListener('mousedown', sliderMove)
    this.slider.addEventListener('touchstart', sliderMove)

    function sliderMove(event: TouchEvent | MouseEvent) {
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
        const marksElement = that.marks.getDOM_element()
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
}