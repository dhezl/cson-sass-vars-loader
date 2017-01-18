"use strict";

const loaderUtils = require("loader-utils");
const fs = require('fs');
const path = require("path");
const CSON = require('cson');


/**
 * Loads SASS variables from an external CSON file, for use with Webpack. Also allows for an
 * additional `data` parameter to be passed, that can either stand alone or provide overrides to
 * individual variables within the CSON file (depending upon if the file is also passed).
 */
module.exports = function (content) {

	var request_parameters = loaderUtils.parseQuery(this.query);

	var compiled_variable_data = (function(){
		var path_variables = collect_variables_from_file(request_parameters.path);
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
	 * [collect_variables_from_file description]
	 * @param  {[type]} query_parameter [description]
	 * @return {[type]}                 [description]
	 */
	function collect_variables_from_file (query_parameter) {
		var cson_file_path = strip_quotes(path.resolve(JSON.stringify(query_parameter)));
		var cson_data = CSON.parse(fs.readFileSync(cson_file_path, 'utf8'));
		return cson_data
	}


	/**
	 * Renders JavaScript object into usable SASS variables.
	 * This routine is essentially unchanged from the original loader: jsontosass-loader
	 * @param  {[type]} obj    [description]
	 * @param  {[type]} indent [description]
	 * @return {[type]}        [description]
	 */
	function render_sass (data, indent) {

		// Make object root properties into sass variables
		var sass = "";
		for (var key in data) {
			sass += "$" + key + ":" + JSON.stringify(data[key], null, indent) + ";\n";
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



	return sass ? sass + '\n' + content : content;
}
