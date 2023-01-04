import Model from './MVC/Model/Model'
import View from './MVC/View/View'
import Controller from './MVC/Controller/Controller'
import {Options} from './Types/Interfaces'

declare global {
  interface Window {
    customSlider: object
  }
}

window.customSlider = function (options:Options, element: HTMLDivElement) {
  return new Controller (new Model(options), new View(element))
}
