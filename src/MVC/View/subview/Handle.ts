import { parsePxInValue, parseValueInPx } from './../../../Utils/Helpers'
import { Options } from './../../../Types/Interfaces'
import { rotation } from './../../../Types/Constants'
import Labels from './Labels'
import Observer from './../../../Utils/Observer'

export default class Handle {
  options: Options
  slider: HTMLDivElement
  observer: Observer
  handle_1: HTMLSpanElement
  handle_2: HTMLSpanElement
  labels: Labels
  first_value: number   // in px
  second_value: number  // in px
  size_slider: number

  constructor(options: Options, observer: Observer) {
    this.options = options
    this.observer = observer
    this.handle_1 = document.createElement('span')
    this.handle_2 = document.createElement('span')
    this.labels = new Labels(this.options, this)
  }
  
  render(slider: HTMLDivElement, size_slider: number): void {
    this.slider = slider
    this.size_slider = size_slider
    const isRange = this.options.range == true
    this.handle_1.classList.add('slider-handle')
    this.handle_2.classList.add('slider-handle')
    const arrOfHandles: Array<HTMLSpanElement> = [this.handle_1]
    if (isRange) arrOfHandles.push(this.handle_2)
    arrOfHandles.forEach(el => this.slider.append(el))
    if (this.options.label === true) this.labels.render()
  }

  init(first_value: number, second_value: number): void  {
    this.first_value = first_value
    this.second_value =  second_value
    this._addListener()
    this._initStyle()
    this.update(this.handle_1, this.first_value)
    this.update(this.handle_2, this.second_value)
  }

  setOptions(options: Options, first_value: number, second_value: number): void {
    this.options = options
    const isRange = this.options.range == true
    this.first_value = first_value
    this.second_value = second_value

    if (isRange) {
      this.handle_1.after(this.handle_2)
      this._initStyle()
      this._addListener()
    } else {
      this.handle_2.remove()
    }

    if (this.options.label == true) {
      this.labels.setOptions(options)
      this.labels.render()
    } else {
      this.labels.delete()
    }
    
    this.broadcast(this.handle_1, this.first_value)
    this.broadcast(this.handle_2, this.second_value)
  }

  update(handle: HTMLSpanElement, spacing_target: number): void {
    const that = this
    const isVertical = this.options.orientation === rotation.VERTICAL
    updatePosition()
    updateLables()

    function updatePosition() {
      isVertical ?
        handle.style.bottom = `${spacing_target}px`
        :
        handle.style.left = `${spacing_target}px`;
    }

    function updateLables() {
      if (that.options.label === true) {
        that.labels.update(
          parsePxInValue(that.first_value, that.options, that.size_slider),
          parsePxInValue(that.second_value, that.options, that.size_slider)
        )
      }
    }
  }

  updateSize(size_slider: number, values: Array<number>) {
    this.size_slider = size_slider
    this.broadcast(this.handle_1, values[0])
    this.broadcast(this.handle_2, values[1])
  }

  broadcast(handle: HTMLSpanElement, spacing_target: number): void  {
    handle == this.handle_1 ?
      this.first_value = spacing_target
      :
      this.second_value = spacing_target

    this.observer.broadcast(this.first_value, this.second_value)
  }

  private _initStyle(): void {
    const isRange = this.options.range == true
    const isVertical = this.options.orientation === rotation.VERTICAL
    const half_width_handle = isVertical ? this.handle_1.offsetHeight / 2 : this.handle_1.offsetWidth / 2
    const borderWidth_of_slider = isVertical ? this.slider.clientTop : this.slider.clientLeft
    const margin = half_width_handle + borderWidth_of_slider

    if (isVertical) {
      this.handle_1.style.marginBottom = `-${margin}px`
      if (isRange) this.handle_2.style.marginBottom = `-${margin}px`
    } else {
      this.handle_1.style.marginLeft = `-${margin}px`
      if (isRange) this.handle_2.style.marginLeft = `-${margin}px`
    }
  }

  getHandle1(): HTMLSpanElement {
    return this.handle_1
  }

  getHandle2(): HTMLSpanElement {
    return this.handle_2
  }

  _addListener(): void {
    const that = this
    const slider = this.slider
    const isRange = this.options.range == true
    const isVertical = this.options.orientation === rotation.VERTICAL
    const step = this.options.step
    const borderWidth_of_slider = isVertical ? slider.clientTop : slider.clientLeft
    
    this.handle_1.addEventListener('mousedown', HandleMove)
    this.handle_1.addEventListener('touchstart', HandleMove)

    if (isRange) {
      this.handle_2.addEventListener('mousedown', HandleMove)
      this.handle_2.addEventListener('touchstart', HandleMove)
    }

    function HandleMove(event: TouchEvent | MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      document.addEventListener('mousemove', MouseMove)
      document.addEventListener('mouseup', MouseUp)
      document.addEventListener('touchmove', MouseMove)
      document.addEventListener('touchend', MouseUp)

      const handle = event.currentTarget as HTMLElement
      const { x } = slider.getBoundingClientRect()
      const { y } = slider.getBoundingClientRect()
      const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
      const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
      let shift: number
      let margin_handle: number

      if (isVertical) {
        shift = (clientY - handle.getBoundingClientRect().top - handle.offsetHeight / 2) || 0    // было || "0"
        margin_handle = parseInt(getComputedStyle(handle).marginTop)
      } else {
        shift = clientX - handle.getBoundingClientRect().left || handle.offsetHeight / 2
        margin_handle = parseInt(getComputedStyle(handle).marginLeft)
      }

      function MouseMove(event: TouchEvent | MouseEvent) {
        const clientX: number = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
        const clientY: number = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY
        const val1 = parsePxInValue(that.first_value, that.options, that.size_slider)
        const val2 = parsePxInValue(that.second_value, that.options, that.size_slider)
        let target: number
        let newRight = that.size_slider

        isVertical ?
          target = -(clientY - y - shift - margin_handle - that.size_slider)
          :
          target = clientX - x - shift - margin_handle - borderWidth_of_slider

        step ? moveIfStep() : moveIfNotStep()

        function moveIfNotStep() {
          if (handle == that.handle_1) {
            if (isRange) newRight = that.second_value
            if (target < 0) target = 0
          } else {
            if (target < that.first_value) target = that.first_value
          }
          if (target > newRight) {
            target = newRight;
          }
          that.broadcast(handle, target)
        }

        function moveIfStep() {
          const step = that.options.step
          let target_up: number
          let target_down: number

          handle == that.handle_1 ? target_up = parseValueInPx(+val1 + +step, that.options, that.size_slider) : target_up = parseValueInPx(+val2 + +step, that.options, that.size_slider)
          handle == that.handle_1 ? target_down = parseValueInPx(+val1 - +step, that.options, that.size_slider) : target_down = parseValueInPx(+val2 - +step, that.options, that.size_slider)

          if (target_up > newRight) target_up = newRight
          if (target_down < 0) target_down = 0

          if (target >= target_up) {
            if (isRange && handle == that.handle_1) newRight = that.second_value
            if (target_up > newRight) { target_up = newRight }
            that.broadcast(handle, target_up)
          }

          if (target <= target_down) {
            if (isRange && handle == that.handle_2 && target_down < that.first_value) target_down = that.first_value
            if (target_down < 0) { target_down = 0 }
            that.broadcast(handle, target_down)
          }
        }
      }

      function MouseUp() {
        document.removeEventListener('mouseup', MouseUp)
        document.removeEventListener('mousemove', MouseMove)
        document.removeEventListener('touchmove', MouseMove)
        document.removeEventListener('touchend', MouseUp)
      }
    }
  }
}