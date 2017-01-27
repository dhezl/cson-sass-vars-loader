"use strict";

const loader_utils = require("loader-utils");
const fs = require('fs');
const path = require("path");
const CSON = require('cson');


/**
 * Loads SASS variables from an external CSON file, for use with Webpack. Also allows for an
 * additional `data` parameter to be passed, that can either stand alone or provide overrides to
 * individual variables within the CSON file (depending upon if the file is also passed).
 */
module.exports = function (content) {

	this.cacheable();
	this.addDependency(cson_file_path);


	var request_parameters = loader_utils.parseQuery(this.query);

	var cson_file_path = strip_quotes(path.resolve(JSON.stringify(request_parameters.path)));

	var compiled_variable_data = (function(){
		var path_variables = collect_variables_from_file(cson_file_path);
		var data_variables = request_parameters.data;
		return Object.assign(path_variables, data_variables);
	})();

	var sass = render_sass(compiled_variable_data);


	/**
	 * Not much here. Just a quick way to strip quotes from a string.
	 * @param  {[type]} string Default output from JSON.stringify
	 * @return {[type]}        String with quotation marks removed.
	 */
	function strip_quotes (string) {
		return string.replace(/["']/g, '');
	}


	/**
	 * Parses CSON data from file.
	 * @param  {String} file_path 		The path to the external CSON file.
	 * @return {Object}                 Javascript data object.
	 */
	function collect_variables_from_file (file_path) {
		var cson_data = CSON.parse(fs.readFileSync(file_path, 'utf8'));
		return cson_data
	}


	/**
	 * Renders JavaScript object into usable SASS variables.
	 * This routine is essentially unchanged from the original loader: jsontosass-loader
	 * @param  {Object} data    Javascript object containing SASS variable information.
	 * @param  {[type]} indent Spacing argument for JSON.stringify
	 * @return {Object}        SASS variables
	 */
	function render_sass (data, indent) {

		// Make object root properties into sass variables
		var sass = "";
		for (var key in data) {
			if ( typeof key === "object" ) {
				console.log('FOO');
			}
			if ( typeof key === "Array" ) {
				// sass += create_breakpoints_from_array(key, data[key]);
			} else {
				sass += "$" + key + ":" + JSON.stringify(data[key], null, indent) + ";\n";
			}
		}

		if (!sass) {
			return sass
		}

		// Store string values (so they remain unaffected)
		var cached_strings = [];
		sass = sass.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function (string) {
			var id = "___CTS" + cached_strings.length;
			cached_strings.push({id: id, value: string});
			return id;
		});

		// Convert js lists and objects into sass lists and maps
		sass = sass.replace(/[{\[]/g, "(").replace(/[}\]]/g, ")");

		// Put string values back (now that we're done converting)
		cached_strings.forEach(function (string) {
			string.value = strip_quotes(string.value);
			sass = sass.replace(string.id, string.value);
		});

		return sass;
	}

	/**
	 * Renders JavaScript object array into usable SASS media queries.
	 * @param  {String} key    Key to use for variable definition
	 * @param  {Array} data    Values to set within media query
	 * @return {String}        Finalized media query.
	 */
	function create_breakpoints_from_array(key, data) {
		data.forEach(function(breakpoint) {
			if ( breakpoint.direction && breakpoint.size && breakpoint.value ) {
				return "@media (" + breakpoint.direction + "-width: " + breakpoint.size + ") { $" + key + ":" + breakpoint.value + "; }\n"
			} else {
				throw new Error("Direction, size, and value are required for adding breakpoints.");
			}
		});
	}

	return sass ? sass + '\n' + content : content;
}
