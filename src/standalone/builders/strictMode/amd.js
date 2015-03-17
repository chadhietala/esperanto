import template from 'utils/template';
import packageResult from 'utils/packageResult';
import { resolveAgainst } from 'utils/resolveId';
import transformBody from './utils/transformBody';
import getImportSummary from './utils/getImportSummary';
import { quote } from 'utils/mappers';

var introTemplate;

introTemplate = template( 'define(<%= amdName %><%= paths %>function (<%= names %>) {\n\n\t\'use strict\';\n\n' );

export default function amd ( mod, options ) {
	var importPaths,
		importNames,
		intro;

	[ importPaths, importNames ] = getImportSummary( mod );

	if ( mod.exports.length ) {
		importPaths.unshift( 'exports' );
		importNames.unshift( 'exports' );
	}

  var resolvedImports = ( options.absolutePaths ? importPaths.map( resolveAgainst( options.amdName ) ) : importPaths ).map( quote );

	intro = introTemplate({
		amdName: options.amdName ? `'${options.amdName}', ` : '',
		paths: importPaths.length ? '[' +  resolvedImports.join(', ') + '], ' : '',
		names: importNames.join( ', ' )
	}).replace( /\t/g, mod.body.getIndentString() );

	transformBody( mod, mod.body, {
		intro: intro,
		outro: '\n\n});',
		_evilES3SafeReExports: options._evilES3SafeReExports
	});

	resolvedImports = resolvedImports.map(function(dep) {
		return dep.replace(/'/g, '');
	});

	mod.deps = {
    imports: resolvedImports,
    exports: ['NOT IMPLEMENTED YET']
	};

	return packageResult( mod, mod.body, options, 'toAmd' );
}
