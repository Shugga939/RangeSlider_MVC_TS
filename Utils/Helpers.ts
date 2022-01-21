import { Options } from "../Types/Interfaces"

function parseValueInPx (val: number, obj_options: Options, size_slider: number) : number {      
  let {min_value, max_value} = obj_options
  return size_slider*(val-min_value) / (max_value-min_value)
}

function parsePxInValue (val: number, obj_options: Options, size_slider: number) : number {
  let {min_value, max_value} = obj_options
  let value = max_value - min_value
  return Number((val/size_slider*value+min_value).toFixed(0))
}

export {parsePxInValue, parseValueInPx}