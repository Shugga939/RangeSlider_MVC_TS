import {parsePxInValue,parseValueInPx} from './../../../Utils/Helpers'
import {Options} from './../../../Types/Interfaces'
import {rotation} from './../../../Types/Constants'
import Labels from './Labels'
import Slider from './Slider'
import Observer from './../../../Utils/Observer'

export default class Handle {
  options: Options
  slider: HTMLDivElement
  observer: Observer
  handle_1: HTMLSpanElement
  handle_2: HTMLSpanElement
  labels: Labels
  isRange: boolean
  isVertical: boolean
  step: number
  first_value: number
  second_value: number
  size_slider: number

  constructor (options: Options,slider: Slider ,observer: Observer) {
    this.options = options
    this.slider = slider.getDOM_element()
    this.observer = observer
    this.handle_1 = document.createElement('span')
    this.handle_1.classList.add('slider-handle')
    this.handle_2 = document.createElement('span')
    this.handle_2.classList.add('slider-handle')
    this.labels = new Labels (this.options,this)
    this.isRange = (options.range == true)
    this.isVertical = (options.orientation === rotation.VERTICAL)
    this.step = options.step 
  }
  
  getHandle1 () :HTMLSpanElement {
    return this.handle_1
  }

  getHandle2 () :HTMLSpanElement {
    return this.handle_2
  }

  setOptions (options: Options, first_value: number, second_value: number) :void {
    this.options = options
    this.isRange = (options.range == true)
    this.step = options.step 
    this.first_value = first_value
    this.second_value = second_value
    if (this.isRange) {
      this.handle_1.after(this.handle_2)
      this.updateStyle()
      this.addListener()
    } else {
       this.handle_2.remove()
    }
    if (this.options.label == true) {
      this.labels.setOptions(options)
      this.labels.render()
    } else {
      this.labels.delete()
    }
  }

  update_handle (handle: HTMLSpanElement, spacing_target:number) :void {
    this.isVertical? handle.style.bottom = `${spacing_target}px`:
                handle.style.left = `${spacing_target}px`;
  
    handle == this.handle_1 ? this.first_value = spacing_target : this.second_value = spacing_target
    this.observer.broadcast(this.first_value, this.second_value)
    if (this.options.label === true) {
      this.labels.update(parsePxInValue(this.first_value,this.options,this.size_slider),
                         parsePxInValue(this.second_value,this.options,this.size_slider))
    }
  }

  renderHandles () :void {
    let arrOfHandles: Array<HTMLSpanElement> = [this.handle_1]
    if (this.isRange) arrOfHandles.push(this.handle_2)
    arrOfHandles.forEach (el=> {this.slider.append(el)})
    if (this.options.label === true) this.labels.render()
  }

  updateStyle () :void {
    let half_width_handle: number
    this.isVertical? half_width_handle = this.handle_1.offsetHeight/2 : half_width_handle = this.handle_1.offsetWidth/2 
    let borderWidth_of_slider: number = this.isVertical? this.slider.clientTop : this.slider.clientLeft 
    let margin = half_width_handle+borderWidth_of_slider

    if (this.isVertical) {                                    
      this.handle_1.style.marginBottom = `-${margin}px`
      if (this.isRange) this.handle_2.style.marginBottom = `-${margin}px`
    } else {
      this.handle_1.style.marginLeft = `-${margin}px`
      if (this.isRange) this.handle_2.style.marginLeft = `-${margin}px`
    }
  }
  addListener () :void {
    let that = this
    const slider = this.slider
    this.size_slider = this.isVertical? slider.getBoundingClientRect().height : 
                                        slider.getBoundingClientRect().width
    let borderWidth_of_slider = this.isVertical? slider.clientTop : slider.clientLeft
    this.handle_1.addEventListener('mousedown', HandleMove)
    this.handle_1.addEventListener('touchstart', HandleMove)
    if (this.isRange) {
      this.handle_2.addEventListener('mousedown', HandleMove)
      this.handle_2.addEventListener('touchstart', HandleMove)
    }

    function HandleMove (event: TouchEvent | MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      document.addEventListener('mousemove', MouseMove)
      document.addEventListener('mouseup', MouseUp)
      document.addEventListener('touchmove', MouseMove)
      document.addEventListener('touchend', MouseUp)
    
      let handle = event.currentTarget as HTMLElement    
      let {x} = slider.getBoundingClientRect()
      let {y} = slider.getBoundingClientRect()
      let clientX = event instanceof TouchEvent? event.touches[0].clientX : event.clientX 
      let clientY = event instanceof TouchEvent? event.touches[0].clientY : event.clientY 
      let shift: number
      let margin_handle: number

      if (that.isVertical) {
        shift = (clientY - handle.getBoundingClientRect().top - handle.offsetHeight/2) || 0    // было || "0"
        margin_handle =  parseInt(getComputedStyle(handle).marginTop)
      } else {
        shift =  clientX - handle.getBoundingClientRect().left || handle.offsetHeight/2
        margin_handle =  parseInt(getComputedStyle(handle).marginLeft)
      }

      function MouseMove (event: TouchEvent | MouseEvent) {
        let clientX: number = event instanceof TouchEvent? event.touches[0].clientX : event.clientX 
        let clientY: number = event instanceof TouchEvent? event.touches[0].clientY : event.clientY 
        let target: number                
        let newRight = that.size_slider   
        let val1 = parsePxInValue(that.first_value,that.options,that.size_slider)  
        let val2 = parsePxInValue(that.second_value,that.options,that.size_slider)  
        that.isVertical? target = -(clientY - y  - shift - margin_handle  - that.size_slider  ) :
                    target = clientX - x -shift - margin_handle - borderWidth_of_slider
                    
        that.step? moveIfStep() : moveIfNotStep()
        
        function moveIfNotStep() {
          if (handle == that.handle_1) {           
            if (that.isRange) newRight = that.second_value   
            if (target < 0) target = 0           
          } else {                               
            if (target < that.first_value) target = that.first_value
          }
          if (target > newRight) {             
            target = newRight;
          }
          that.update_handle(handle,target)
        }
        function moveIfStep () {
          let step = that.step
          let target_up: number
          let target_down: number
    
          handle == that.handle_1? target_up = parseValueInPx(+val1+ +step, that.options,that.size_slider  ) : target_up = parseValueInPx(+val2+ +step, that.options,that.size_slider  )
          handle == that.handle_1? target_down = parseValueInPx(+val1- +step, that.options,that.size_slider  ) : target_down = parseValueInPx(+val2- +step, that.options,that.size_slider  )
          
          if(target_up> newRight) target_up = newRight 
          if(target_down < 0) target_down = 0          
    
          if(target>=target_up) {                     
            if (that.isRange && handle == that.handle_1) newRight = that.second_value
            if (target_up> newRight) {target_up = newRight}
            that.update_handle(handle,target_up)
          }
          if (target<=target_down){               
            if (that.isRange && handle == that.handle_2 && target_down<that.first_value) target_down = that.first_value
            if(target_down<0) {target_down = 0}
            that.update_handle(handle,target_down)
          } 
        }
      }
      function MouseUp () {
        document.removeEventListener('mouseup', MouseUp)
        document.removeEventListener('mousemove', MouseMove)
        document.removeEventListener('touchmove', MouseMove)
        document.removeEventListener('touchend', MouseUp)
      }
    }
  }
}