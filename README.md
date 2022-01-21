# RangeSlider_MVC_TS

**RangeSlider** - this is plugin that allows you to select a value or range of values. This project is based on the use of the MVC pattern and using TypeScript.

## Watch result on github.io

- [Demo with 2 rangeSliders](https://shugga939.github.io/Range-slider_MVC_TS.github.io/)

## How to use plugin

Add style and script files to html code:

```html
<html>
  <head>
    <link rel="stylesheet" href="Range-slider.css">
    <body>
      <script type="text/javascript" src="RangeSlider.js"></script>
    </body>
  </head>
</html>
```

The Rangeslider is automatically initialized in the global scope by the Slider object. The first parameter is an object with settings; the second parameter is the node in which the slider is created.

```javascript
let slider = new Slider({
  min_value : 0,
  max_value : 100,
  values : [50],
  separator : ' - ',
  modifier : '%',
  range : '',  
  orientation : "vertical",
  label : '',
  step : '',  
  marks : ''
},slider_container)
```

The **slider** object has a **setOptions** method that accepts an object with options to update the slider.

```javascript
slider.setOptions({range : true}) // active range
slider.setOptions({marks : [
    {
      value: 1000,
      label: '1K'
    },
    {
      value: 2000,
      label: '2K'
    }
  ]) // add array of marks
```
The **slider** object has a **getValue** method that return the array of current slider values.

```javascript
slider.getValue() // return [number, nubmer | undefined]
```

## Options

| Option       | Type     | Defaults | Description                                                                                      |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------------------ |
| min_value    | number   | 0        | Set slider minimum value                                                                         |
| maxValue     | number   | 100      | Set slider maximum value                                                                         |
| values       | array    | 30,60    | Set start position for handles. Use first value for single value slider.                         |
| range        | boolean  | true     | Set slider handles count - one or two.                                                           |
| orientation  | string   | vertical | Set slider position - 'vertical' or 'horizontal'.                                                |
| label        | boolean  | false    | Enable labels.                                                                                   |
| step         | number   | 0        | Set slider step.                                                                                 |
| marks        | object\* | ''       | Сomplex object from an array marks the elements in the slider.                                   |
| separator    | string   | ' - '    | Set separator of values.                                                                         |
| modifier     | string   | ''       | Set modifier for values (example : "$","%"...)                                                   |

\*Complex object with next fieds:

| Option | Description
| ------ | -----------
| value  | Actual value for slider
| label  | Displayed value
