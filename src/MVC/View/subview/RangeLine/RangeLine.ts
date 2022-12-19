import {Options} from '../../../../Types/Interfaces'
import {rotation} from '../../../../Types/Constants'
import Handle from '../Handle/Handle'

export default class RangeLine {
    rangeLine : HTMLElement
    slider : HTMLElement
    handle: Handle
    options : Partial<Options>
    half_width_handle : number
    borderWidth_of_slider : number
    isRange: boolean
    isVertical: boolean
  
    constructor (options: Partial<Options>, handle: Handle) {
      this.handle = handle
      this.rangeLine  = document.createElement('span')
      this.isRange = (options.range == true)
      this.isVertical = (options.orientation === rotation.VERTICAL)
    }
    
    render (slider : HTMLElement) : void {
      this.slider = slider
      this.rangeLine.classList.add('slider-range')
      this.slider.append(this.rangeLine)
    }
    
    init(first_value: number, second_value: number) {
      this.updateStyle()
      this.update(first_value, second_value)
    }

    setOptions (options: Options, first_value: number, second_value: number) : void {
      this.options = options
      this.isRange = options.range === true
      this.updateStyle()
      this.update(first_value, second_value)
    }
  
    update (first_value: number, second_value: number) : void {
      const that = this
      this.isRange? update_if_isRange() : update_if_notRange()
  
      function update_if_isRange () {
        if (that.isVertical) {
          that.rangeLine.style.height = `${second_value - first_value}px`
          that.rangeLine.style.bottom = `${first_value - that.borderWidth_of_slider}px`
        } else {
          that.rangeLine.style.width = `${second_value - first_value}px`
          that.rangeLine.style.left = `${first_value + that.half_width_handle-parseInt(getComputedStyle(that.slider).paddingLeft)}px`
        }
      }

      function update_if_notRange () {
        if (that.isVertical) {
          that.rangeLine.style.height = `${first_value + parseInt(getComputedStyle(that.slider).paddingTop)}px`
          that.rangeLine.style.bottom = `${-that.borderWidth_of_slider}px`
        } else {
          that.rangeLine.style.width = `${first_value + parseInt(getComputedStyle(that.slider).paddingLeft)}px`
          that.rangeLine.style.left = `${that.half_width_handle-parseInt(getComputedStyle(that.slider).paddingLeft)}px`
        }
      }
    }
  
    updateStyle () {
      this.half_width_handle = this.handle.getHandle1().offsetWidth/2   
      this.borderWidth_of_slider = this.isVertical? this.slider.clientTop : this.slider.clientLeft 
      const margin = this.half_width_handle + this.borderWidth_of_slider
      this.isVertical? this.rangeLine.style.marginTop= `-${margin}px` :
                  this.rangeLine.style.marginLeft = `-${margin}px`
    }
  }