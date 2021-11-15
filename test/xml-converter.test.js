const { parseXML } = require( '../index.js' );

test( 'Parsing simple xml.', () => {
  const xml = `<rootNode>
<parenttag>
    <tag>value</tag>
    <tag>65.34</tag>
</parenttag>
</rootNode>`;

  expect( parseXML( xml ) ).toEqual( {
    rootNode: [
      {
        value: '',
        attrs: {},
        self: false,
        parenttag: [
          {
            value: '',
            attrs: {},
            self: false,
            tag: [
              {
                value: 'value',
                attrs: {},
                self: false,
              },
              {
                value: '65.34',
                attrs: {},
                self: false,
              }
            ]
          }
        ]
      }
    ],
  } );

} );

test( 'Parsing more complex xml with self-closing tag.', () => {
  const xml = `<rootNode>
  <parenttag>
      <tag>value</tag>
      <tag>45</tag>
      <tag>65.34</tag>
  </parenttag>
  <parenttag>
      <tag>value</tag>
      <tag3/>
      <tag>45</tag>
      <tag>65.34</tag>
  </parenttag>
  </rootNode>`;

  expect( parseXML( xml ) ).toEqual( {
    rootNode: [
      {
        value: '',
        attrs: {},
        self: false,
        parenttag: [
          {
            value: '',
            attrs: {},
            self: false,
            tag: [
              {
                value: 'value',
                attrs: {},
                self: false,
              },
              {
                value: '45',
                attrs: {},
                self: false,
              },
              {
                value: '65.34',
                attrs: {},
                self: false,
              }
            ]
          },
          {
            value: '',
            attrs: {},
            self: false,
            tag: [
              {
                value: 'value',
                attrs: {},
                self: false,
              },
              {
                value: '45',
                attrs: {},
                self: false,
              },
              {
                value: '65.34',
                attrs: {},
                self: false,
              }
            ],
            tag3: [
              {
                value: '',
                attrs: {},
                self: true,
              }
            ]
          }
        ]
      }
    ],
  } );

} );

test( 'Parsing xml with attributes.', () => {
  const xml = `<rootNode>
  <parenttag attr1='some val' attr2='another val' >
    <tag>value</tag>
    <tag3 attr />
    <tag attr1='val' attr2='234'>45</tag>
    <tag>65.34</tag>
  </parenttag>
  </rootNode>`;

  expect( parseXML( xml ) ).toEqual( {
    rootNode: [
      {
        value: '',
        attrs: {},
        self: false,
        parenttag: [
          {
            value: '',
            attrs: { attr1: 'some val', attr2: 'another val' },
            self: false,
            tag: [
              {
                value: 'value',
                attrs: {},
                self: false,
              },
              {
                value: '45',
                attrs: { attr1: 'val', attr2: '234' },
                self: false,
              },
              {
                value: '65.34',
                attrs: {},
                self: false,
              }
            ],
            tag3: [
              {
                value: '',
                attrs: { attr: true },
                self: true,
              }
            ]
          }
        ]
      }
    ],
  } );
} );

test( 'Parsing xml with CDATA.', () => {
  const xml = `<rootNode>
  <parenttag attr1='some val' attr2='another val' >
    <tag>value</tag>
    <tag attr1='val' attr2='234'>45</tag>
    <tag>65.34</tag>
    <![CDATA[<sender>John Smith</sender>]]>
  </parenttag>
  </rootNode>`;

  expect( parseXML( xml ) ).toEqual( {
    rootNode: [
      {
        value: '',
        attrs: {},
        self: false,
        parenttag: [
          {
            value: '',
            attrs: { attr1: 'some val', attr2: 'another val' },
            self: false,
            tag: [
              {
                value: 'value',
                attrs: {},
                self: false,
              },
              {
                value: '45',
                attrs: { attr1: 'val', attr2: '234' },
                self: false,
              },
              {
                value: '65.34',
                attrs: {},
                self: false,
              }
            ],
            CDATA: [
              {
                value: '<sender>John Smith</sender>',
                attrs: {},
                self: true,
              }
            ]
          }
        ]
      }
    ],
  } );
} );

test( 'Parsing attributes with different quotes.', () => {
  const xml = `<rootNode>
  <parenttag attr1='some val' attr2="another val" >
  </parenttag>
  </rootNode>`;

  expect( parseXML( xml ) ).toEqual( {
    rootNode: [
      {
        value: '',
        attrs: {},
        self: false,
        parenttag: [
          {
            value: '',
            attrs: { attr1: 'some val', attr2: 'another val' },
            self: false,
          }
        ]
      }
    ],
  } );
} );
