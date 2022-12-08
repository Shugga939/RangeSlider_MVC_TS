import { rotation } from "../Types/Constants"
import { Options } from "../Types/Interfaces"
import { parseValueInPx, parsePxInValue } from "./Helpers"

const options_1 : Options = {
  min_value : 0,
  max_value : 150,
  values : [0],
  separator : '',
  modifier : '',
  range : false,  
  orientation : rotation.VERTICAL,
  label : false,
  step : 1,  
  marks : []
}

const options_2 : Options = {
  min_value : 150,
  max_value : 450,
  values : [150],
  separator : '',
  modifier : '',
  range : false,  
  orientation : rotation.VERTICAL,
  label : false,
  step : 1,  
  marks : []
}

const options_3 : Options = {
  min_value : 444,
  max_value : 999,
  values : [444],
  separator : '',
  modifier : '',
  range : false,  
  orientation : rotation.VERTICAL,
  label : false,
  step : 1,  
  marks : []
}

describe('Test parseValueInPx func', ()=> {
  test ('lower value', ()=> {
    expect(parseValueInPx(1,options_1,500)).toBeCloseTo(3.33, 2)
  })
  
  test ('middle value', ()=> {
    expect(parseValueInPx(300,options_2,750)).toBeCloseTo(375, 2)
  })
  
  test ('high value', ()=> {
    expect(parseValueInPx(998,options_3,675)).toBeCloseTo(673.78, 2)
  })
})

describe('Test parsePxInValue func', ()=> {
  test ('lower value', ()=> {
    expect(parsePxInValue(2,options_1,500)).toBe(1)
  })
  
  test ('middle value', ()=> {
    expect(parsePxInValue(375,options_2,750)).toBe(300)
  })
  
  test ('high value', ()=> {
    expect(parsePxInValue(674,options_3,675)).toBe(998)
  })
})