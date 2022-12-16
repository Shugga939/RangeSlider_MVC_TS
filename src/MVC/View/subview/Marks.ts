import { parseValueInPx } from './../../../Utils/Helpers'

import { Options, Mark } from './../../../Types/Interfaces'
import { rotation } from './../../../Types/Constants'

import Handle from './Handle'

export default class Marks {
  options: Options
  marksArray: Array<Mark>
  handle: Handle
  slider: HTMLDivElement
  marksContainer: HTMLDivElement
  size_slider: number
  marks: Array<HTMLSpanElement>

  constructor(options: Options, handle: Handle) {
    this.options = options     
    this.handle = handle
    this.marksContainer = document.createElement('div')
    this.marks = []
  }
  
  render(slider: HTMLDivElement, size_slider: number) {
    this.slider = slider
    if (this.options.marks.length) {
      this.size_slider = size_slider
      this.marksContainer.classList.add('marks')
      const half_width_handle: number = this.handle.getHandle1().offsetWidth / 2

      this.options.marks.forEach(element => {
        const mark: HTMLSpanElement = document.createElement('span')
        mark.textContent = element.label
        mark.classList.add('mark')
        mark.setAttribute('data-value', `${element.value}`)
        
        if (this.options.orientation === rotation.VERTICAL) {
          this.marksContainer.classList.add('marks_vertical')
          mark.style.bottom = `${parseValueInPx(element.value, this.options, this.size_slider) - this.size_slider - half_width_handle}px`
        } else {
          this.marksContainer.classList.add('marks_horizontal')
          mark.style.left = `${parseValueInPx(element.value, this.options, this.size_slider)}px`
        }
        this.marks.push(mark)
        this.marksContainer.append(mark)
      });
      this.slider.append(this.marksContainer)
    }
  }
  
  init(): void {
    this.updateStyle()
  }

  updateStyle(): void {
    const arrOfMarks = [...this.marksContainer.children] as Array<HTMLElement>
    arrOfMarks.forEach((el) => {
      el.style.marginLeft = `-${el.offsetWidth / 2}px`
    })
  }

  updateSize(size_slider: number): void {
    this.size_slider = size_slider
    const half_width_handle: number = this.handle.getHandle1().offsetWidth / 2
    this.options.marks.forEach((element, index) => {
      if (this.options.orientation === rotation.VERTICAL) {
        this.marks[index].style.bottom = `${parseValueInPx(element.value, this.options, this.size_slider) - this.size_slider - half_width_handle}px`
      } else {
        this.marks[index].style.left = `${parseValueInPx(element.value, this.options, this.size_slider)}px`
      }
    })
  }

  delete(): void {
    Array.from(this.marksContainer.children).forEach(el => el.remove())
    this.marksContainer.remove()
    this.marks = []
  }

  getDOM_element(): HTMLDivElement {
    return this.marksContainer
  }

  setOptions(option: Options): void {
    this.options = option
    if (this.options.marks.length) {
      this.delete()
      this.render(this.slider, this.size_slider)
      this.updateStyle()
    } else {
      this.delete()
    }
  }
}