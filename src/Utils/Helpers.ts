import { Options } from "../Types/Interfaces"

function parseValueInPx(val: number, options: Options, size_slider: number): number {
  const { min_value, max_value } = options
  return size_slider * (val - min_value) / (max_value - min_value)
}

function parsePxInValue(val: number, options: Options, size_slider: number): number {
  const { min_value, max_value } = options
  const value = max_value - min_value
  return Number((val / size_slider * value + min_value).toFixed(0))
}

export { parsePxInValue, parseValueInPx }