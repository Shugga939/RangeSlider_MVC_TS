import { Options } from './../../Types/Interfaces'

import Model from './../Model/Model'
import View from './../View/View'


class Controller {
  model: Model
  view: View

  constructor(model: Model, view: View) {
    this.model = model
    this.view = view
    this.view.init(this.model.getOptions())
  }

  setOptions(opt: Options) {
    this.model.setOption(opt)
    this.view.setOption(this.model.getOptions())
  }

  getValue() {
    return this.view.getCurrentValues()
  }
}

export default Controller