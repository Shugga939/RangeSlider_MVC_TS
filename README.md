# RangeSlider_MVC_TS

**RangeSlider** - Плагин для выбора диапазонов значений. Проект написан на TypeScript, по методологии ООП и паттерину проектирования - MVC.


## Содержание

- [Демонстрация работы на githubPages](#demonstration)
- [Установка](#installation)
- [Команды](#commands)
- [Архитектура](#MVC)
- [Подключение](#creation)

## <a name="demonstration"></a> Демонстрация работы на githubPages

[Demonstration of sliders](https://shugga939.github.io/RangeSlider_MVC_TS/)


## <a name="installation"></a> Установка

1.Clone

```console
// Клонируйте репозиторий
git clone https://github.com/Shugga939/RangeSlider_MVC_TS.git

// или
git clone git@github.com:Shugga939/RangeSlider_MVC_TS.git
```

2.Open

```console
// Перейдите в папку с репозиторием

cd RangeSlider_MVC_TS
```

3.Init

```console
// Установите зависимости

npm install
```

## <a name="commands"></a> Команды

### `npm run serve`

Запускает локальный сервер с результатом _development_ сборки.

### `npm run build`

Запускает _production_ сборку и сохраняет результат в папку `/public`.

### `npm run test`

Запускает jest тестирование и показывает процент покрытия тестами.



## <a name="MVC"></a> Архитектура

### Model - View - Controller

**Model** - отвечает за хранение и валидацию получаемых слайдером параметров.

**View** - отвечает за визуальное отображение самого слайдера и инпута для ввода/отображения значений. Включает в себя отдельные компоненты **subView** (ползунки, диапазон и пр.). _**subView**_ - хранит в себе опциональные, независимые компоненты, которые можно расширять. **View** хранит в себе значения ползунков и соответственно актуальные значения слайдера.

**Controller** - отвечает за инициализацию **View** и **Model**. Решает вопрос с передачей данных между компонентами. Имеет API для взаимодействия с внешними скриптами. Передает новые параметры в **Model** для валидации и возвращает их во **View** для изменения состояния слайдера. Отвечает за передачу актуальных значений из **View**).

**Observer** - вспомогательный паттерн добавляет возможность подписанным компонентам _**subView**_  взаимодейтствовать с состоянием **View**, тем самым запуская процесс обновления всех компонентов _**subView**_.



## <a name="creation"></a> Подключение

Подключите стили и скрипт в html: 

```html
<html>
  <head>
    <link rel="stylesheet" href="Range-slider.css">
  </head>
  <body>
    <script type="text/javascript" src="RangeSlider.js"></script>
  </body>
</html>
```

### Инициализация

Слайдер инициализируется в глобальное пространство (проект учебный). При создании экземпляра в конструктор первым параметром передается объект с параметрами (в противном случае инициализируются стандартные параметры), и html element - контейнер, где будет инициализирован слайдер.

```javascript
const container = document.querySelector('.slider')
const options = {
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
}
const slider = new customSlider(options, container)
```


### Изменение параметров созданного слайдера

У объекта слайдера **slider** есть метод **setOptions** для изменения параметров слайдера "на лету".

```javascript
slider.setOptions({range : true}) // включить диапазон
slider.setOptions({marks : [
    {
      value: 1000,
      label: '1K'
    },
    {
      value: 2000,
      label: '2K'
    }
  ]}) // добавить метки значений
```

### Доступные параметры слайдера

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


### Получение текущих значений

У объекта слайдера **slider** есть метод **getValue** который возвращает массив актуальных значений.

```javascript
slider.getValue() // return [number, nubmer | undefined]
```