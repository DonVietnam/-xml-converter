# xml-converter

A module for converting between XML format and JavaScript objects.

[Documentation in Russian](lang/README-RU.md)

## Requirements

- Node.js version >=16.

## Installation

`npm i xml-converter`

## Examples of using

### Parsing XML to JavaScript object.
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
  <summary>Result</summary>
  
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

### Parsing JavaScript object to XML.
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
  <summary>Result</summary>
  
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

## Arguments

### parseXML( xml )

| Argument | Type | Description |
| --- | --- | --- |
| xml | string | Valid xml string. |

### parseObject( object, indentSize )

| Argument | Type | Description |
| --- | --- | --- |
| object | object | Valid object described in the next section. |
| indentSize | number | Indent size for xml string. |

## Fields and type of the object returned from the parseXML().

| Field | Type | Description |
| --- | --- | --- |
| value | string | Value of the XML tag. |
| attrs | object | Object with tag's attributes { attributeName: 'attributeValue' }. |
| self | boolean | Flag indicating whether the tag is self-closing. |
| \[tag\] | array | Array with child-tags with same tag name. |

<details>
  <summary>Example</summary>
  
  ```
  //object
  {
    root: [ // root tag name
      { // object, root tag
        value: '', // root tag value
        attrs: {}, // root tag attributes
        self: false,
        child: [ // child tag name
          { // object, child tag
            value: '', // child tag value...
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

