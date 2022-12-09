import { parseValueInPx } from './../../../Utils/Helpers'
import { Options, Mark } from './../../../Types/Interfaces'
import { rotation } from './../../../Types/Constants'

import Handle from './Handle'
import Slider from "./Slider"

export default class Marks {
  options: Options
  marksArray: Array<Mark>
  handle: Handle
  slider: Slider
  marks: HTMLDivElement
  size_slider: number

  constructor(options: Options, slider: Slider, handle: Handle) {
    this.options = options     
    this.slider = slider
    this.handle = handle
    this.marks = document.createElement('div')
  }
  
  render(size_slider: number) {
    if (this.options.marks.length) {
      this.size_slider = size_slider
      this.marks.classList.add('marks')
      const half_width_handle: number = this.handle.getHandle1().offsetWidth / 2

      this.options.marks.forEach(element => {
        const mark: HTMLSpanElement = document.createElement('span')
        mark.textContent = element.label
        mark.classList.add('mark')
        mark.setAttribute('data-value', `${element.value}`)

        if (this.options.orientation === rotation.VERTICAL) {
          this.marks.classList.add('marks_vertical')
          mark.style.bottom = `${parseValueInPx(element.value, this.options, this.size_slider) - this.size_slider - half_width_handle}px`
        } else {
          this.marks.classList.add('marks_horizontal')
          mark.style.left = `${parseValueInPx(element.value, this.options, this.size_slider)}px`
        }
        this.marks.append(mark)
      });
      this.slider.slider.append(this.marks)
    }
  }
  
  init(): void {
    this.updateStyle()
  }

  updateStyle(): void {
    let arrOfMarks = [...this.marks.children] as Array<HTMLElement>
    arrOfMarks.forEach((el) => {
      el.style.marginLeft = `-${el.offsetWidth / 2}px`
    })
  }

  delete(): void {
    Array.from(this.marks.children).forEach(el => el.remove())
    this.marks.remove()
  }

  getDOM_element(): HTMLDivElement {
    return this.marks
  }

  setOptions(option: Options): void {
    this.options = option
    if (this.options.marks.length) {
      this.delete()
      this.render(this.size_slider)
      this.updateStyle()
    } else {
      this.delete()
    }
  }
}