import {Options} from './../../../Types/Interfaces'
import {rotation} from './../../../Types/Constants'

export default class RangeLine {
    rangeLine : HTMLElement
    isRange: boolean
    isVertical: boolean
    slider : HTMLElement
    options : Partial<Options>
    half_width_handle : number
    borderWidth_of_slider : number
  
    constructor (options: Partial<Options>, slider : HTMLElement) {
      this.rangeLine  = document.createElement('span')
      this.rangeLine.classList.add('slider-range')
      this.isRange = (options.range == true)
      this.isVertical = (options.orientation === rotation.VERTICAL)
      this.slider = slider
    }
  
    renderLine () : void {
      this.slider.append(this.rangeLine)
    }
  
    setOptions (options: Partial<Options>) : void {
      this.options = options
      this.isRange = (options.range === true)
    }
  
    update (first_value: number,second_value: number) : void {
      let that = this
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
  
    updateStyle (handle:HTMLElement) {
      this.half_width_handle = handle.offsetWidth/2   
      this.borderWidth_of_slider = this.isVertical? this.slider.clientTop : this.slider.clientLeft 
      let margin = this.half_width_handle + this.borderWidth_of_slider
  
      this.isVertical? this.rangeLine.style.marginTop= `-${margin}px` :
                  this.rangeLine.style.marginLeft = `-${margin}px`
    }
  }