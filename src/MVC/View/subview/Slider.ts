import { parsePxInValue, parseValueInPx } from './../../../Utils/Helpers'
import Handle from './Handle'
import { Options } from './../../../Types/Interfaces'
import Marks from './../subview/Marks'
import { rotation } from './../../../Types/Constants'
import Observer from './../../../Utils/Observer'
import RangeLine from './RangeLine'

export default class Slider {
  options: Options
  app: HTMLDivElement
  observer: Observer
  slider: HTMLDivElement
  marks: Marks
  handle: Handle
  first_handle: HTMLSpanElement
  second_handle: HTMLSpanElement
  rangeLine: RangeLine
  first_value: number
  second_value: number
  isRange: boolean
  isVertical: boolean
  step: number

  constructor(options: Options, app: HTMLDivElement, observer: Observer) {
    this.options = options
    this.app = app
    this.observer = observer
    this.slider = document.createElement('div')
    this.handle = new Handle(this.options, this.slider, this.observer)
    this.rangeLine = new RangeLine(this.options, this.slider, this.handle)
    this.marks = new Marks(this.options, this, this.handle)
    this.isRange = options.range === true
    this.isVertical = options.orientation === rotation.VERTICAL
    this.step = options.step
  }

  renderSlider(): void {
    this.slider.classList.add('range-slider')
    this.app.append(this.slider)
    this.handle.renderHandles()
    this.rangeLine.renderLine()
    if (this.options.marks.length) {
      this.marks.render()
    }
  }

  init(first_value: number, second_value: number) {
    this.first_value = first_value
    this.second_value = this.isRange ? second_value : first_value
    this._initScripts()
    this._initStyles()
  }

  getDOM_element(): HTMLDivElement {
    return this.slider
  }

  setOptions(options: Options, first_value: number, second_value: number) {
    this.first_value = first_value
    this.second_value = this.isRange ? second_value : first_value
    // this._initStyles()
    this.options = options
    this.isRange = options.range === true
    this.isVertical = options.orientation === rotation.VERTICAL
    this.first_value = options.values[0]
    if (this.isRange) this.second_value = options.values[1]? options.values[1] : options.values[0]

    this.handle.setOptions(options, this.first_value, this.second_value)
    this.rangeLine.setOptions(options, this.first_value, this.second_value)
    // this.rangeLine.update(this.first_value, this.second_value)
    // this.handle.update(this.handle.getHandle1(), this.first_value)
    // this.handle.update(this.handle.getHandle2(), this.second_value)
    if (this.options.marks.length) {
      this.marks.setOptions(this.options)
    } else {
      this.marks.delete()
    }
  }

  update(first_value: number, second_value: number) {
    this.first_value = first_value
    this.second_value = this.isRange ? second_value : first_value
    this.rangeLine.update(this.first_value, this.second_value)
  }

  private _initStyles() {
    this.handle.updateStyle()
    this.handle.update(this.handle.getHandle1(), this.first_value)
    this.handle.update(this.handle.getHandle2(), this.second_value)
    this.rangeLine.update(this.first_value, this.second_value)
  }

  private _initScripts() {
    this._addListener(this.first_value, this.second_value)
    this.handle.addListener()
  }

  private _addListener(first_value: number, second_value: number) {
    const triggerEvent = new Event('mousedown')
    const that = this
    this.first_value = first_value
    this.second_value = this.isRange ? second_value : first_value
    this.first_handle = this.handle.getHandle1()
    this.second_handle = this.handle.getHandle2()
    const size_slider = that.isVertical ? 
      that.slider.getBoundingClientRect().height 
      :                                              // вынести во view и повесить слушатель
      that.slider.getBoundingClientRect().width     // на изменение окна и

    this.slider.addEventListener('mousedown', sliderMove)
    this.slider.addEventListener('touchstart', sliderMove)

    function sliderMove(event: TouchEvent | MouseEvent) {
      event.preventDefault()
      const clientX: number = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
      const clientY: number = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
      const { y } = that.slider.getBoundingClientRect()
      const { x } = that.slider.getBoundingClientRect()
      let target: number

      that.isVertical ? target = -(clientY - y - size_slider) :
        target = clientX - x

      if (event.target != that.first_handle && event.target != that.second_handle) {
        if (that.marks) moveToMark()
        if (target < that.first_value) moveLeftHandle()
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
              target = parseValueInPx(Number(element.dataset.value), that.options, size_slider)
            }
          })
        }
      }

      function moveLeftHandle(): void {
        if (parseInt(target.toFixed(1)) - 2 < 0) target = 0
        if (that.step) parseTargetToStep()
        that.handle.update(that.first_handle, target)
        that.first_handle.dispatchEvent(triggerEvent)
      }

      function moveBetweenHandle(): void {
        if ((target - that.first_value) <= (that.second_value - target)) {
          if (that.step) parseTargetToStep()
          that.handle.update(that.first_handle, target)
          that.first_handle.dispatchEvent(triggerEvent)
        } else {
          if (that.step) parseTargetToStep()
          that.handle.update(that.second_handle, target)
          that.second_handle.dispatchEvent(triggerEvent)
        }
      }

      function moveRightHandle(): void {
        if (parseInt(target.toFixed(1)) >= size_slider - 1) { target = size_slider }
        if (that.step) parseTargetToStep()
        if (that.isRange) {
          that.handle.update(that.second_handle, target)
          that.second_handle.dispatchEvent(triggerEvent)
        } else {
          that.handle.update(that.first_handle, target)
          that.first_handle.dispatchEvent(triggerEvent)
        }
      }

      function parseTargetToStep(): void {
        const { min_value, max_value } = that.options
        const step = that.options.step
        const value = (max_value - min_value) / step
        const val2 = step / value
        const val3 = parsePxInValue(target, that.options, size_slider) / value
        target = parseValueInPx(Math.round(val3 / val2) * step, that.options, size_slider)
      }
    }
  }
}