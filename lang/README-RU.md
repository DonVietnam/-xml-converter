# xml-converter

Пакет для перевода XML строки в объект JavaScript и обратно.

## Требования

- Версия Node.js от 16 и выше.

## Установка

`npm i xml-converter`

## Примеры использования

### Перевод XML в JavaScript объект.
```
const { parseXML } = require( 'xml-converter' );

const xml = `<root>
<child>
    <tag>string value</tag>
    <tag>78</tag>
</child>
</root>`;

const object = parseXML( xml );
```
<details>
  <summary>Результат</summary>
  
  ```
  //object
  {
    root: [
      {
        value: '',
        attrs: {},
        self: false,
        child: [
          {
            value: '',
            attrs: {},
            self: false,
            tag: [
              {
                value: 'string value',
                attrs: {},
                self: false,
              },
              {
                value: '78',
                attrs: {},
                self: false,
              }
            ]
          }
        ]
      }
    ],
  }
  ```
</details>

### Перевод JavaScript объекта обратно в XML.
```
const { parseObject } = require( 'xml-converter' );

const object = {
    root: [
      {
        value: '',
        attrs: {},
        self: false,
        child: [
          {
            value: '',
            attrs: {},
            self: false,
            tag: [
              {
                value: 'string value',
                attrs: {},
                self: false,
              },
              {
                value: '78',
                attrs: {},
                self: false,
              }
            ]
          }
        ]
      }
    ],
  }

const xml = parseObject( object, 2 );
```

<details>
  <summary>Результат</summary>
  
  ```
  //xml
  `<root>
  <child>
    <tag>string value</tag>
    <tag>78</tag>
  </child>
</root>`
  ```
</details>

## Аргументы функций.

### parseXML( xml )

| Аргумент | Тип | Описание |
| --- | --- | --- |
| xml | string | Валидная строка XML. |

### parseObject( object, indentSize )

| Аргумент | Тип | Описание |
| --- | --- | --- |
| object | object | Объект в формате, описанном в секции ниже. |
| indentSize | number | Величина отступов в пробелах в xml строке. |

## Тип и поля объекта возвращаемого функцией parseXML().

| Поле | Тип | Описание |
| --- | --- | --- |
| value | string | Значение XML тега. |
| attrs | object |Объект с атрибутами тега { attributeName: 'attributeValue' }. |
| self | boolean | Флаг обозначающий, что тег - самозакрывающийся. |
| \[tag\] | array | Массив дочерних тегов с одинаковыми именами. |

<details>
  <summary>Пример</summary>
  
  ```
  //object
  {
    root: [ // имя тега root
      { //объект, содержащий тег root
        value: '', // значение тега root
        attrs: {}, // атрибуты тега root
        self: false,
        child: [ // имя тега, вложенного в тег root
          { //объект, содержащий дочерний тег
            value: '', // значение дочернего тега...
            attrs: {},
            self: false,
            tag: [
              {
                value: 'string value',
                attrs: {},
                self: false,
              },
              {
                value: '78',
                attrs: {},
                self: false,
              }
            ]
          }
        ]
      }
    ],
  }
  ```
</details>


