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
  first_value: number     // in px
  second_value: number    // in px
  size_slider: number    // in px

  constructor(options: Options, app: HTMLDivElement, observer: Observer) {
    this.options = options
    this.app = app
    this.observer = observer
    this.handle = new Handle(this.options, this.observer)
    this.rangeLine = new RangeLine(this.options, this.handle)
    this.marks = new Marks(this.options, this.handle)
  }
  
  renderSlider(): void {
    this.slider = document.createElement('div')  
    this.slider.classList.add('range-slider')
    this.app.append(this.slider)
    this._setSliderWidth()
    this.handle.render(this.slider, this.size_slider)
    this.rangeLine.render(this.slider)
    this.marks.render(this.slider, this.size_slider)
  }

  setValues(first_value: number, second_value: number) {
    const isRange = this.options.range === true
    this.first_value = first_value
    this.second_value = isRange ? second_value : first_value
  }

  private _setSliderWidth() {
    const isVertical = this.options.orientation === rotation.VERTICAL
    this.size_slider = isVertical ? 
      this.slider.getBoundingClientRect().height 
      :                                             
      this.slider.getBoundingClientRect().width   
  }

  init(first_value: number, second_value: number) {
    this.setValues(first_value, second_value)
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
    this.setValues(first_value, second_value)
    this.handle.setOptions(options, this.first_value, this.second_value)
    this.rangeLine.setOptions(options, this.first_value, this.second_value)
    this.marks.setOptions(this.options)
  }

  update(first_value: number, second_value: number) {
    this.setValues(first_value, second_value)
    this.handle.update(this.first_handle, first_value)
    this.handle.update(this.second_handle, second_value)
    this.rangeLine.update(this.first_value, this.second_value)
  }

  updateSize(size_slider: number, values: Array<number>) {
    this.size_slider = size_slider
    this.handle.updateSize(size_slider)
    this.handle.broadcast(this.first_handle, values[0])
    this.handle.broadcast(this.second_handle, values[1])
  } 

  getDOM_element(): HTMLDivElement {
    return this.slider
  }

  private _addListener() {
    const triggerEvent = new Event('mousedown')
    const that = this
    const isVertical = this.options.orientation === rotation.VERTICAL
    const isRange = this.options.range === true
    const {step} = this.options
    this.first_handle = this.handle.getHandle1()
    this.second_handle = this.handle.getHandle2()
    
    this.slider.addEventListener('mousedown', sliderMove)
    this.slider.addEventListener('touchstart', sliderMove)

    function sliderMove(event: TouchEvent | MouseEvent) {
      event.preventDefault()
      const clientX: number = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
      const clientY: number = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
      const { y } = that.slider.getBoundingClientRect()
      const { x } = that.slider.getBoundingClientRect()
      let target: number

      isVertical ? target = -(clientY - y - that.size_slider) :
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
              target = parseValueInPx(Number(element.dataset.value), that.options, that.size_slider)
            }
          })
        }
      }

      function moveLeftHandle(): void {
        if (parseInt(target.toFixed(1)) - 2 < 0) target = 0
        if (step) parseTargetToStep()
        that.handle.broadcast(that.first_handle, target)
        that.first_handle.dispatchEvent(triggerEvent)
      }

      function moveBetweenHandle(): void {
        if ((target - that.first_value) <= (that.second_value - target)) {
          if (step) parseTargetToStep()
          that.handle.broadcast(that.first_handle, target)
          that.first_handle.dispatchEvent(triggerEvent)
        } else {
          if (step) parseTargetToStep()
          that.handle.broadcast(that.second_handle, target)
          that.second_handle.dispatchEvent(triggerEvent)
        }
      }

      function moveRightHandle(): void {
        if (parseInt(target.toFixed(1)) >= that.size_slider - 1) { target = that.size_slider }
        if (step) parseTargetToStep()
        if (isRange) {
          that.handle.broadcast(that.second_handle, target)
          that.second_handle.dispatchEvent(triggerEvent)
        } else {
          that.handle.broadcast(that.first_handle, target)
          that.first_handle.dispatchEvent(triggerEvent)
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