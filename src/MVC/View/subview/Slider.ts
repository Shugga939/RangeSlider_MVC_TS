import {parsePxInValue,parseValueInPx} from './../../../Utils/Helpers'
import Handle from './Handle'
import {Options} from './../../../Types/Interfaces'
import Marks from './../subview/Marks'
import {rotation} from './../../../Types/Constants'
import Observer from './../../../Utils/Observer'

export default class Slider {
  options: Options
  app: HTMLDivElement
  observer: Observer
  slider: HTMLDivElement
  marks: Marks
  isRange: boolean
  isVertical: boolean
  step: number
  handle: Handle
  first_value: number
  second_value: number
  first_handle: HTMLSpanElement
  second_handle: HTMLSpanElement

  constructor (options: Options, app: HTMLDivElement, observer: Observer) {
    this.options = options
    this.app = app
    this.observer = observer
    this.slider = document.createElement('div')
    this.slider.classList.add('range-slider')
    this.marks = new Marks (this.options,this)
    this.isRange = (options.range === true)
    this.isVertical = (options.orientation === rotation.VERTICAL)
    this.step = options.step 
  }

  renderSlider(handle: Handle) :void {
    this.app.append(this.slider)
    this.handle = handle
    if (this.options.marks.length) {
      this.marks.render(handle)
      this.marks.updateStyle()
    }
  }
  
  getDOM_element () : HTMLDivElement {
    return this.slider
  }

  setOptions (options: Options) {
    this.options = options
    this.isRange = (options.range === true)
    if (this.options.marks.length) {
      this.marks.delete()
      this.marks.setOptions(this.options)
      this.marks.render(this.handle)
      this.marks.updateStyle()
    } else {
      this.marks.delete()
    }
  }

  update (first_value: number, second_value: number) {
    this.first_value = first_value
    this.second_value = this.isRange? second_value : first_value
  }

  addListener (first_value: number, second_value: number, handle_obj:Handle) {
    const triggerEvent = new Event ('mousedown')
    const that = this
    this.first_value = first_value
    this.second_value = this.isRange? second_value : first_value
    this.first_handle = handle_obj.getHandle1()
    this.second_handle = handle_obj.getHandle2()
    let size_slider = that.isVertical? that.slider.getBoundingClientRect().height : 
                                       that.slider.getBoundingClientRect().width
    this.slider.addEventListener('mousedown', sliderMove)
    this.slider.addEventListener('touchstart', sliderMove)

    function sliderMove (event: TouchEvent | MouseEvent) { 
      event.preventDefault()
      let clientX: number = event instanceof TouchEvent? event.touches[0].clientX : event.clientX 
      let clientY: number = event instanceof TouchEvent? event.touches[0].clientY : event.clientY 
      let {y} = that.slider.getBoundingClientRect() 
      let {x} = that.slider.getBoundingClientRect()  
      let target: number
    
      that.isVertical? target = -(clientY - y - size_slider) :
                  target = clientX - x
                  
      if (event.target != that.first_handle && event.target != that.second_handle) {  
        if (that.marks) moveToMark()     
        if (target < that.first_value) moveLeftHandle ()               
        if (target > that.first_value && target < that.second_value) moveBetweenHandle ()           
        if (target > that.second_value) moveRightHandle () 
      }

      function moveToMark () {
        let marks = that.marks.getDOM_element()
        let targetElement = event.target as HTMLElement
        if (targetElement.parentElement == marks) {
          let arrOfMarks = [...marks.children] as Array<HTMLElement>
          arrOfMarks.forEach((element) => {
            if (event.target == element) {
              target = parseValueInPx(Number(element.dataset.value), that.options,size_slider)
            }
          })
        }
      }
      function moveLeftHandle () :void {
        if (parseInt(target.toFixed(1))-2<0) target = 0
        if (that.step) parseTargetToStep ()
        handle_obj.update_handle(that.first_handle,target)
        that.first_handle.dispatchEvent(triggerEvent)
      }
      function moveBetweenHandle () :void { 
        if ((target - that.first_value) <= (that.second_value - target)) {  
          if (that.step) parseTargetToStep ()
          handle_obj.update_handle(that.first_handle,target)
          that.first_handle.dispatchEvent(triggerEvent)
        } else {
          if (that.step) parseTargetToStep ()
          handle_obj.update_handle(that.second_handle,target)
          that.second_handle.dispatchEvent(triggerEvent)
        }
      }
      function moveRightHandle () :void {
        if (parseInt(target.toFixed(1)) >= size_slider-1) {target = size_slider} 
        if (that.step) parseTargetToStep ()
        if (that.isRange) {
          handle_obj.update_handle(that.second_handle,target)
          that.second_handle.dispatchEvent(triggerEvent)
          } else {
          handle_obj.update_handle(that.first_handle,target)
          that.first_handle.dispatchEvent(triggerEvent)
        }
      }
      function parseTargetToStep () :void {
        let {min_value, max_value} = that.options
        let step = that.options.step
        let value = (max_value - min_value)/step
        let val2 = step/value                 
        let val3 = parsePxInValue(target,that.options,size_slider)/value                 
        target = parseValueInPx(Math.round(val3/val2)*step,that.options,size_slider)
      }
    }
  }
}