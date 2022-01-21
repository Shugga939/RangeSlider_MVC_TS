import {Options} from './../../../Types/Interfaces'
import {rotation} from './../../../Types/Constants'
import Handle from './Handle'

export default class Labels {
  options: Options
  handle: Handle
  label1: HTMLSpanElement
  label2: HTMLSpanElement
  constructor(options: Options, handle: Handle) {
    this.options = options
    this.handle = handle
    this.label1 = document.createElement('span')
    this.label1.classList.add('value_label')
    this.label2 = document.createElement('span')
    this.label2.classList.add('value_label')
  }

  render () :void {
    this.handle.getHandle1().append(this.label1)
    if (this.options.range) this.handle.getHandle2().append(this.label2)
    if (this.options.orientation == rotation.VERTICAL) {
      this.label1.classList.add('label_vertical')
      if(this.options.range == true) this.label2.classList.add('label_vertical')
    } else {
      this.label1.classList.add('label_horizontal')
      if(this.options.range == true) this.label2.classList.add('label_horizontal')
    }
  }

  setOptions (opt: Options) :void  {
    this.options = opt
  }

  delete () :void  {
    this.label1.remove()
    this.label2.remove()
  }

  update (first_value: number, second_value: number) :void  {
    this.label1.textContent = `${first_value}`
    let half_width_handle: number = this.handle.getHandle1().offsetWidth/2
    let half_size_firstLabel: number
    
    if (this.options.orientation === rotation.VERTICAL) {
      half_size_firstLabel = this.label1.offsetHeight/2
      this.label1.style.marginTop = `${half_width_handle - half_size_firstLabel-this.label1.clientTop}px`
    } else{
      half_size_firstLabel = this.label1.offsetWidth/2
      this.label1.style.marginLeft = `${half_width_handle - half_size_firstLabel-this.label1.clientLeft}px`
    }
    
    if (this.options.range == true) {
      this.label2.textContent = `${second_value}`
      let half_size_secondLabel: number
      if (this.options.orientation == rotation.VERTICAL) {
        half_size_secondLabel = this.label2.offsetHeight/2
        this.label2.style.marginTop = `${half_width_handle - half_size_secondLabel-this.label2.clientTop}px`
      } else{
        half_size_secondLabel = this.label2.offsetWidth/2
        this.label2.style.marginLeft = `${half_width_handle - half_size_secondLabel-this.label2.clientLeft}px`
      }
    }
  }
}