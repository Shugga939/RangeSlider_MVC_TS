import {rotation} from './Constants'

type Options = {
  min_value : number
  max_value : number
  values : [number,number] | [number]
  separator : string,
  modifier : string,
  range : boolean,  
  orientation : rotation,
  label : boolean,
  step : number,  
  marks : Array<Mark>
}

type Mark = {
  value: number
  label: string
}

export {Options, Mark}