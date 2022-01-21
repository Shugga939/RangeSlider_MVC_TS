
class Observer {
  observers : Array<Function>
  constructor(){
    this.observers = []
  }
  subscribe (fn: Function) {
    this.observers.push(fn)
  }
  broadcast (value1: number, value2: number) {
    this.observers.forEach(func =>{
      switch (func.name){
      case 'updateValue' : {func(value1,value2)}
      }
    })
  }
}

export default Observer
