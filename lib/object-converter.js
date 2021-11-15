const { getIndent } = require( './helpers' );

const getAttrsString = ( attrs ) => {
  let result = '';

  for ( const attr in attrs ) {
    if ( typeof attrs[ attr ] === 'boolean'  && attrs[ attr ] ) {
      result += ` ${ attr } `;
    } else {
      result += ` ${ attr }="${ attrs[ attr ] }" `;
    }
  }

  return result;
};

const getCDATAString = ( value ) => `<![CDATA[${ value }]]>`;

const parseObject = ( object, indentSize = 1, name = '!xml', level = 0 ) => {
  const attrs = getAttrsString( object.attrs );
  let children = '';
  const indent = getIndent( level * indentSize - indentSize );
  if ( object.self === true ) {
    if ( name === 'CDATA' ) {
      return `${ indent }${ getCDATAString( object.value ) }\n`;
    }
    return `${ indent }<${ name }${ attrs }/>\n`;
  } else {
    for ( const key in object ) {
      if ( key !== 'attrs' && key !== 'value' && key !== 'self' ) {
        for ( const child of object[ key ] ) {
          children += parseObject( child, indentSize, key, level + 1 );
        }
      }
    }
  }

  if ( name !== '!xml' ) {
    const childrenStr = children ? '\n' + children + indent : '';
    return `${ indent }<${ name }${ attrs }>${ object.value }${ childrenStr }</${ name }>\n`;
  } else {
    return children.substring( 0, children.length - 1 );
  }
};

module.exports = { parseObject };
