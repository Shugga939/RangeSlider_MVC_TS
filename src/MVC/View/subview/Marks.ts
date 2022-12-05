import {parseValueInPx} from './../../../Utils/Helpers'
import {Options, Mark} from './../../../Types/Interfaces'
import {rotation} from './../../../Types/Constants'

import Handle from './Handle'
import Slider from "./Slider"

export default class Marks {
  options: Options
  handle: Handle
  slider: Slider
  marks: HTMLDivElement
  constructor (options:Options,slider: Slider) {
    this.options = options
    this.slider = slider
    this.marks = document.createElement('div')
    this.marks.classList.add('marks')
  }

  render (handle: Handle) {
    this.handle = handle
    const slider: HTMLElement = this.slider.getDOM_element()
    let half_width_handle: number = this.handle.getHandle1().offsetWidth/2
    let size_slider: number = this.options.orientation === rotation.VERTICAL?
                      slider.getBoundingClientRect().height : 
                      slider.getBoundingClientRect().width
    let arrOfMarks: Array<Mark> = this.options.marks

    arrOfMarks.forEach(element => {
      const mark: HTMLSpanElement = document.createElement('span')
      mark.textContent = element.label
      mark.classList.add('mark')
      mark.setAttribute('data-value', `${element.value}`)
      if (this.options.orientation === rotation.VERTICAL) {
        this.marks.classList.add('marks_vertical') 
        mark.style.bottom = `${parseValueInPx(element.value,this.options,size_slider)-size_slider-half_width_handle}px`
      } else {
        this.marks.classList.add('marks_horizontal')
        mark.style.left = `${parseValueInPx(element.value,this.options,size_slider)}px`
      }
      this.marks.append(mark)
    });
    this.slider.slider.append(this.marks)
  }

  updateStyle () :void {
    let arrOfMarks = [...this.marks.children] as Array<HTMLElement>
    arrOfMarks.forEach((el) => {
        el.style.marginLeft = `-${el.offsetWidth/2}px`
    })
  }

  delete () :void {
    Array.from(this.marks.children).forEach( el => {
      el.remove()
    })
    this.marks.remove()
  }
  getDOM_element() :HTMLDivElement {
    return this.marks
  }
  setOptions(opt: Options) :void {
    this.options = opt
  }
}