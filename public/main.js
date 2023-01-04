const sliders = document.querySelectorAll('.slider')
const [slider_container_1, slider_container_2] = sliders

const slider1 = new customSlider({
  min_value: 0,
  max_value: 100,
  values: [50],
  separator: ' - ',
  modifier: '%',
  range: '',
  orientation: "vertical",
  label: '',
  step: 0,
  marks: []
}, slider_container_1)

const slider2 = new customSlider({
  min_value: 1000,
  max_value: 5000,
  values: [1500, 4500],
  separator: ' - ',
  modifier: '$',
  range: true,
  orientation: "horizontal",
  label: true,
  step: 100,
  marks: [
    {
      value: 1000,
      label: '1K'
    },
    {
      value: 2000,
      label: '2K'
    },
    {
      value: 3000,
      label: '3K'
    },
    {
      value: 4000,
      label: '4K'
    },
    {
      value: 5000,
      label: '5K'
    },
  ]
}, slider_container_2)

const controls = document.querySelectorAll('.controls')
addListeners(controls[0], slider1)
addListeners(controls[1], slider2)

function addListeners(element, slider) {

  const rangeCheckbox = element.querySelector('[name = "range"]')
  rangeCheckbox.addEventListener('change', function () {
    this.checked ? slider.setOptions({ range: true }) : slider.setOptions({ range: false })
  })

  const labelCheckbox = element.querySelector('[name = "label"]')
  labelCheckbox.addEventListener('change', function () {
    this.checked ? slider.setOptions({ label: true }) : slider.setOptions({ label: false })
  })

  const min_value = element.querySelector('[name = "min_value"]')
  min_value.addEventListener('change', function () {
    slider.setOptions({ 'min_value': +min_value.value })
  })

  const max_value = element.querySelector('[name = "max_value"]')
  max_value.addEventListener('change', function () {
    slider.setOptions({ 'max_value': +max_value.value })
  })

  const step = element.querySelector('[name = "step"]')
  step.addEventListener('change', function () {
    slider.setOptions({ 'step': +step.value })
  })

  const setup_value = element.querySelector('[name = "setup_value"]')
  setup_value.addEventListener('change', function () {
    let arr_values = setup_value.value.split(',')
    const val2 = arr_values[1] ? arr_values[1].trim() : undefined
    arr_values = [arr_values[0].trim(), val2]
    slider.setOptions({ 'values': arr_values })
  })
}


