const {
  removeFormatting,
  findNextIndex,
  checkValue,
  getAllMatches,
  isNext
} = require( './helpers' );

const attrReg = new RegExp( '([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g' );

class ParseNode {
  constructor( name = '', parent = null, value = '' ) {
    this.name = name;
    this.parent = parent;
    this.value = value;
    this.children = {};
    this.attrs = {};
    this.self = false;
  }

  addChild( node ) {
    if ( Object.hasOwn( this.children, node.name ) ) {
      this.children[ node.name ].push( node );
    } else {
      this.children[ node.name ] = [ node ];
    }
  }
}

const resolveNameSpace = ( name ) => {
  const tags = name.split( ':' );
  const prefix = name.at( 0 ) === '/' ? '/' : '';

  if ( tags[ 0 ] === 'xmlns' ) {
    return '';
  }

  if ( tags.length === 2 ) {
    return prefix + tags[ 1 ];
  }

  return name;
};

const findCloseTag = ( data, i ) => {
  let attrBoundary = '';
  let expression = '';
  for ( let index = i; index < data.length; index++ ) {
    const char = data[ index ];
    if ( attrBoundary ) {
      if ( char === attrBoundary ) {
        attrBoundary = '';
      }
    } else if ( char === '"' || char === '\'' ) {
      attrBoundary = char;
    } else if  ( char === '>' ) {
      return { expression, closeIndex: index };
    }
    expression += char === '\t' ? ' ' : char;
  }
};

const convertToObject = ( node ) => {
  const result = node.name !== '!xml' ? { attrs: node.attrs, value: node.value, self: node.self } : {};

  for ( const childName in node.children ) {
    result[ childName ] = [];
    for ( const child of node.children[ childName ] ) {
      result[ childName ].push( convertToObject( child ) );
    }
  }

  return result;
};

const buildAttributesMap = ( string ) => {
  const data = removeFormatting( string );
  const matches = getAllMatches( data, attrReg );
  const attrs = {};

  for ( let i = 0; i < matches.length; i++ ) {
    const name = resolveNameSpace( matches[ i ][ 1 ] );
    if ( name.length ) {
      if ( matches[ i ][ 4 ] !== undefined ) {
        attrs[ name ] = matches[ i ][ 4 ];
      } else {
        attrs[ name ] = true;
      }
    }
  }

  return attrs;
};

const charHandlers = {

  '/': ( data, value, node, index ) => {
    const closeCharIndex = findNextIndex( data, index, '>', `Missing closing symbol at ${ index }!` );
    node.value += checkValue( value );
    node = node.parent;
    return [ closeCharIndex, '', node ];
  },

  '?': ( data, value, node, index ) => [
    findNextIndex( data, index, '?>', `Pi tag is not closed at ${ index }!` ),
    value,
    node
  ],

  '!--': ( data, value, node, index ) => [
    findNextIndex( data, index, '-->', `Comment is not closed at ${ index }!` ),
    value,
    node
  ],

  '!D': ( data, value, node, index ) => {
    const closeCharIndex = findNextIndex( data, index, '>', `DOCTYPE is not closed at ${ index }!` );
    const expression = data.substring( index, closeCharIndex );
    if ( expression.indexOf( '[' ) >= 0 ) {
      index = data.indexOf( ']>', index ) + 1;
    } else {
      index = closeCharIndex;
    }

    return [ closeCharIndex, value, node ];
  },

  '![': ( data, value, node, index ) => {
    const closeCharIndex = findNextIndex( data, index, ']]>', `CDATA is not closed at ${ index }!` ) - 2;
    const expression = data.substring( index + 9, closeCharIndex );
    node.value += checkValue( value );
    value = '';

    const cdata = new ParseNode( 'CDATA', node, expression );
    cdata.self = true;
    node.addChild( cdata );

    return [ closeCharIndex + 2, '', node ];
  },

  '<': ( data, value, node, index ) => {
    const closeTag = findCloseTag( data, index + 1 );
    let expression = closeTag.expression;
    const closeIndex = closeTag.closeIndex;
    const separatorIndex = expression.indexOf( ' ' );
    let name = expression;

    if ( separatorIndex !== -1 ) {
      name = expression.substr( 0, separatorIndex ).replace( /\s\s*$/, '' );
      expression = expression.substr( separatorIndex + 1 );
    }

    if ( node.name !== '!xml' ) {
      node.value += checkValue( value );
    }

    const selfCloseTag = expression.at( -1 ) === '/';
    if ( selfCloseTag ) {
      expression = expression.substr( 0, expression.length - 1 );
      if ( name.at( -1 ) === '/' ) {
        name = expression;
      }
    }

    const child = new ParseNode( name, node );
    if ( name !== expression ) {
      child.attrs = buildAttributesMap( expression );
    }

    if ( selfCloseTag ) {
      child.self = true;
    }

    node.addChild( child );
    return [ closeIndex, '', !selfCloseTag ? child : node ];
  }
};

const buildTree = ( xml ) => {
  const data = removeFormatting( xml );
  const root = new ParseNode( '!xml' );
  let node = root;
  let value = '';
  const specialChars = [ '/', '?', '!--', '!D', '![' ];

  for ( let i = 0; i < data.length; i++ ) {
    const char = data[ i ];

    if ( char === '<' ) {
      let isSpecial = false;
      for ( const special of specialChars ) {
        if ( isNext( data, i, special ) ) {
          [ i, value, node ] = charHandlers[ special ]( data, value, node, i );
          isSpecial = true;
          break;
        }
      }
      if ( !isSpecial ) {
        [ i, value, node ] = charHandlers[ '<' ]( data, value, node, i );
      }
    } else {
      value += data[ i ];
    }
  }

  return root;
};

const parseXML = ( xml ) => {
  const tree = buildTree( xml );
  const object = convertToObject( tree );

  return object;
};

module.exports = { parseXML };
