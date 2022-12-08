import { Options } from './../../../Types/Interfaces'
import { rotation } from './../../../Types/Constants'
import Handle from './Handle'

export default class Labels {
  handle: Handle
  label1: HTMLSpanElement
  label2: HTMLSpanElement
  isRange: boolean
  isVertical: boolean

  constructor(options: Options, handle: Handle) {
    this.handle = handle
    this.label1 = document.createElement('span')
    this.label2 = document.createElement('span')
    this.isRange = options.range === true
    this.isVertical = options.orientation === rotation.VERTICAL
  }

  render(): void {
    this.label1.classList.add('value_label')
    this.label2.classList.add('value_label')
    
    this.handle.getHandle1().append(this.label1)
    if (this.isRange) this.handle.getHandle2().append(this.label2)

    if (this.isVertical) {
      this.label1.classList.add('label_vertical')
      if (this.isRange) this.label2.classList.add('label_vertical')
    } else {
      this.label1.classList.add('label_horizontal')
      if (this.isRange) this.label2.classList.add('label_horizontal')
    }
  }

  setOptions(options: Options): void {
    this.isRange = options.range === true
    this.isVertical = options.orientation === rotation.VERTICAL
  }

  delete(): void {
    this.label1.remove()
    this.label2.remove()
  }

  update(first_value: number, second_value: number): void {
    this.label1.textContent = `${first_value}`
    const half_width_handle: number = this.handle.getHandle1().offsetWidth / 2
    let half_size_firstLabel: number

    if (this.isVertical) {
      half_size_firstLabel = this.label1.offsetHeight / 2
      this.label1.style.marginTop = `${half_width_handle - half_size_firstLabel - this.label1.clientTop}px`
    } else {
      half_size_firstLabel = this.label1.offsetWidth / 2
      this.label1.style.marginLeft = `${half_width_handle - half_size_firstLabel - this.label1.clientLeft}px`
    }

    if (this.isRange) {
      this.label2.textContent = `${second_value}`
      let half_size_secondLabel: number
      if (this.isVertical) {
        half_size_secondLabel = this.label2.offsetHeight / 2
        this.label2.style.marginTop = `${half_width_handle - half_size_secondLabel - this.label2.clientTop}px`
      } else {
        half_size_secondLabel = this.label2.offsetWidth / 2
        this.label2.style.marginLeft = `${half_width_handle - half_size_secondLabel - this.label2.clientLeft}px`
      }
    }
  }
}