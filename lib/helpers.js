const removeFormatting = ( string ) =>  string.replace( /[\n,\r]/g, '' );

const findNextIndex = ( data, index, string, error ) => {
  const result = data.indexOf( string, index );
  if ( result < 0 ) {
    throw new Error( error );
  } else {
    return result + string.length - 1;
  }
};

const checkValue = ( value ) => {
  if ( typeof value !== 'undefined' ) {
    for ( const char of value ) {
      if ( char !== ' ' ) {
        return value;
      }
    }
  }

  return '';
};

const getAllMatches = ( string, regexp ) => {
  const matches = [];
  let match = regexp.exec( string );
  while ( match ) {
    match.startIndex = regexp.lastIndex - match[ 0 ].length;
    matches.push( match );
    match = regexp.exec( string );
  }
  return matches;
};

const isNext = ( string, index, substring ) => string.substr( index + 1, substring.length ) === substring;

const getIndent = ( level ) => level > 0 ? ' '.repeat( level ) : '';

module.exports = {
  removeFormatting,
  findNextIndex,
  checkValue,
  getAllMatches,
  isNext,
  getIndent
};
