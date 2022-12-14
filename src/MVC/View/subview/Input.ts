import {parsePxInValue,parseValueInPx} from './../../../Utils/Helpers'
import {Options} from './../../../Types/Interfaces'
import Handle from './Handle'

export default class Input {
  options: Options
  input: HTMLInputElement
  handle: Handle
  size_slider: number
  first_handle: HTMLSpanElement
  second_handle: HTMLSpanElement
  
  constructor (options: Options) {
    this.options = options
  }
  
  renderInput (app: HTMLDivElement) :void {
    this.input = document.createElement('input')
    this.input.classList.add('slider-value')
    this.input.type = 'text'
    app.append(this.input)
  }
  
  setOptions (options: Options) :void {
    this.options = options
    // this.isRange = (options.range == true)
  }

  update (first_value: number, second_value: number) {         
    const {separator = '', modifier = ''} = this.options
    const isRange = this.options.range === true
    
    if (isRange) {
      this.input.value = first_value + modifier + separator + second_value + modifier
    } else {
      this.input.value = first_value + modifier
    }
  }

  // addListener (handle: Handle, size_slider: number) :void {
  //   this.handle = handle
  //   this.size_slider = size_slider
  //   const that = this
  //   this.first_handle = handle.getHandle1()
  //   this.second_handle = handle.getHandle2()

  //   this.input.addEventListener('change', function (event) {
  //     let val =  that.input.value;
  //     let {min_value, max_value, separator = '', modifier = ''} = that.options       
  //     let [val1, val2] = parseValue(val)                         
  //     if (val1 > val2 || val2 < val1) [val1,val2] = [val2,val1]
  //     handle.update_handle(that.first_handle, parseValueInPx(val1,that.options,size_slider))
  //       if (that.isRange) {
  //         handle.update_handle(that.second_handle, parseValueInPx(val2,that.options,size_slider))
  //         that.input.value = val1 + modifier + separator + val2 + modifier 
  //       } else {                                                             
  //         that.input.value = val1 + modifier
  //       }
    
  //     function parseValue (value: string) :[number,number] {
  //       let value1 = parseInt(value)
  //       let value2: number | undefined;
    
  //       if (separator && that.isRange) {                             
  //         value1 = parseInt(value.split(separator)[0])
  //         value2 = parseInt(value.split(separator)[1])
  //       } else if (modifier && that.isRange) {                         
  //         value1 = parseInt(value.split(modifier)[0])
  //         value2 = parseInt(value.split(modifier)[1])
  //       } else if (!that.isRange) {
  //         value1 = parseInt(value)
  //       }
    
  //       if (isNaN(value1)) value1 = min_value            
              
  //       return [checkMinMax(value1,min_value,max_value),   
  //               checkMinMax(value2,min_value,max_value)]
  //     }
    
  //     function checkMinMax (val: number | undefined, minValue: number, maxValue:number) :number {  
  //       if (val && (val < minValue)) {
  //         return minValue
  //       } else if (val && (val > maxValue)) {
  //         return maxValue
  //       } else if (!val) {
  //         return minValue
  //       } else {
  //         return val
  //       }
  //     }
  //   })
  // }
}