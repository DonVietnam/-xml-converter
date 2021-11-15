const { parseObject } = require( '../index.js' );

test( 'Convert simple object.', () => {
  const object = {
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
  };
  expect( parseObject( object, 2 ) ).toEqual( `<rootNode>
  <parenttag>
    <tag>value</tag>
    <tag>65.34</tag>
  </parenttag>
</rootNode>` );
} );

test( 'Convert more complex object with self-closing tag.', () => {
  const object = {
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
  };
  expect( parseObject( object, 2 ) ).toEqual( `<rootNode>
  <parenttag>
    <tag>value</tag>
    <tag>45</tag>
    <tag>65.34</tag>
  </parenttag>
  <parenttag>
    <tag>value</tag>
    <tag>45</tag>
    <tag>65.34</tag>
    <tag3/>
  </parenttag>
</rootNode>` );
} );

test( 'Convert object with attributes.', () => {
  const object = {
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
  };

  expect( parseObject( object, 2 ) ).toEqual( `<rootNode>
  <parenttag attr1="some val"  attr2="another val" >
    <tag>value</tag>
    <tag attr1="val"  attr2="234" >45</tag>
    <tag>65.34</tag>
    <tag3 attr />
  </parenttag>
</rootNode>` );
} );

test( 'Convert object with CDATA.', () => {
  const object = {
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
  };

  expect( parseObject( object, 2 ) ).toEqual( `<rootNode>
  <parenttag attr1="some val"  attr2="another val" >
    <tag>value</tag>
    <tag attr1="val"  attr2="234" >45</tag>
    <tag>65.34</tag>
    <![CDATA[<sender>John Smith</sender>]]>
  </parenttag>
</rootNode>` );
} );
