import Model from './../Model/Model'
import View from './../View/View'
import {Options} from './../../Types/Interfaces'


class Controller {
  model: Model
  view: View
  constructor (model: Model, view: View) {
    this.model = model
    this.view = view
    this.view.renderDOM(this.model.getOptions())
    this.view.initValues()
    this.view.initStyles()
    this.view.initScripts()
  }

  setOptions (opt: Options) {
    this.model.setOption(opt)
    this.view.update(this.model.getOptions())
  }

  getValue () {
    return this.view.getCurrentValues()
  }
}

export default Controller