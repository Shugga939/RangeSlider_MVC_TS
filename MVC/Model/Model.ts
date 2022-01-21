import {Options} from './../../Types/Interfaces'
import {rotation} from './../../Types/Constants'

class Model {
  options : Options
  constructor (options: Options) {
    this.options = options || this.initDefoultOptions()
    this.checkCorrectValues(this.options)
    if (this.options.marks) this.checkMarksObject()
  }
  
  getOptions() :Options {
    return this.options
  }
  
  setOption(options:Options) {
    this.options = {...this.options, ...options}
    this.checkCorrectValues(this.options)
    if (this.options.marks) this.checkMarksObject()
  }
  
  private initDefoultOptions() : Options {
    return {
      min_value : 0,
      max_value : 100,
      values : [30,60],
      separator : ' - ',
      modifier : '',
      range : true,  
      orientation : rotation.VERTICAL,
      label : false,
      step : 0,  
      marks : [
        {
          value: 0,
          label: `${0}`
        },
        {
          value: 100,
          label: `${100}`
        }]
    };
  }

  private checkCorrectValues (options:Options) :void {
    let isRange = options.range
    let step = options.step
    let {min_value, max_value, values: [val1,val2]} = options
    checkStartingValues()

    if (!checkOverstatementOrUnderstatement(min_value, max_value, val1, val2)) {
      options.values = [min_value, max_value]
      console.log( new Error ('Укажите корректные значения в опциях'))
    }
    if (step && (isNaN(options.step) || step <=0)) options.step = (max_value - min_value)/10
    
    function checkOverstatementOrUnderstatement (min_value:number, max_value:number,val1:number, val2:number| undefined) {
      let isZeroValue = (val1 === 0 && min_value === 0)? true : false
      if ((isZeroValue || val1) && val2 && isRange) return (val1 >= min_value && val1 <= max_value) && (val2 >= min_value && val2 <= max_value) && (val1 <= val2)
      if ((isZeroValue || val1) && !val2  && !isRange) return (val1 >= min_value && val1 <= max_value)
    }

    function checkStartingValues () :void {
      if (!min_value && !max_value) {
        options.min_value = 0
        min_value = 0
        options.max_value = 100
        max_value = 100
      }
      if ((min_value > max_value) || (min_value == max_value)){
        options.max_value = min_value+1
        max_value = min_value+1
      } 
      if ((val2) && val1 > val2) { 
        options.values = [val2, val1];
        [val1,val2] = [val2,val1]
      }
    }

  }
  private checkMarksObject () :void {
    this.options.marks = this.options.marks.filter(element => 
      element.value <= this.options.max_value && element.value >= this.options.min_value
    );
  }
}

export default Model