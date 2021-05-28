const validators = require("./data.validators")

const e = {}



/**
 * Takes care of substituting the handle bars
 *
 * @param      {Object}  jsonData  The json data
 * @return     {Object}  The transformed data
 */
function fixJSON(jsonData) {
	let data = { ...jsonData }
	return data
}

/**
 * Takes care of substituting the handle bars
 *
 * @param      {Object}  arrayData  The json data
 * @return     {Object}  The transformed data
 */
function fixArray(arrayData) {
	let data = { ...arrayData }
	return data
}

/**
 * Takes care of substituting the handle bars
 *
 * @param      {string}  stringData  The json data
 * @return     {string}  The transformed data
 */
function fixString(stringData) {
	let data = stringData
	return data
}

e.fillThePlaceholders = _data => {
	let typeOfData = validators.whatIsThis(_data)
	if (typeOfData = 1) fixJSON(_data)
	else if (typeOfData = 2) fixArray(_data)
	else fixString(_data)
}

module.exports = e