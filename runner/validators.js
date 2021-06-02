const e = {}


/**
 * Checks the typr od data
 *
 * @param      {*}  data    The data
 * @return     {number}  The number representing the type. 
 * - 1 - Object
 * - 2 - Array
 * - 3 - String
 * - 4 - Number
 * - 5 - Boolean
 */
e.whatIsThis = (data) => {
	if (Object.prototype.toString.call(data) == "[object Object]") return 1;
	if (Object.prototype.toString.call(data) == "[object Array]") return 2;
	if (Object.prototype.toString.call(data) == "[object String]") return 3;
	if (Object.prototype.toString.call(data) == "[object Number]") return 4;
	if (Object.prototype.toString.call(data) == "[object Boolean]") return 5;
	return 0;
}


/**
 * Flattens a JSON
 *
 * @param      {string}  _parent  The parent
 * @param      {Object}  _json    The json
 * @return     {Object}  Flattened JSON
 */
function flattenJSON(_parent, _json) {
	let data = {}
	for (let _key in _json) {
		switch (e.whatIsThis(_json[_key])) {
			case 1:
				data = { ...data, ...flattenJSON(`${_parent}.${_key}`, _json[_key]) }
				break;
			case 2:
				data = { ...data, ...flattenArray(`${_parent}.${_key}`, _json[_key]) }
				break;
			default:
				data[`${_parent}.${_key}`] = _json[_key]
				break;
		}
	}
	return data
}


/**
 *
 * @param {string} _parent
 * @param {Object[]} _array
 * @returns {Object}
 */
function flattenArray(_parent, _array) {
	let data = {}
	_array.forEach((_data, _index) => {
		switch (e.whatIsThis(_data)) {
			case 1:
				data = { ...data, ...flattenJSON(`${_parent}.${_index}`, _data) }
				break;
			case 2:
				data = { ...data, ...flattenArray(`${_parent}.${_index}`, _data) }
				break;
			default:
				data[`${_parent}.${_index}`] = _data
				break;
		}
	})
	return data
}

/**
 *
 * @param {Object} _object
 * @returns {Object}
 */
e.flatten = (_object) => {
	let data = {}
	for (let _key in _object) {
		switch (e.whatIsThis(_object[_key])) {
			case 1:
				data = { ...data, ...flattenJSON(_key, _object[_key]) }
				break;
			case 2:
				data = { ...data, ...flattenArray(_key, _object[_key]) }
				break;
			default:
				data[_key] = _object[_key]
				break;
		}
	}
	return data
}

/**
 *
 * @param {Object} _expected
 * @param {Object} _received
 * @returns {Object[]}
 */
e.compareJSON = (_expected, _received) => {
	const expected = e.flatten(_expected)
	const received = e.flatten(_received)
	const errors = []
	for (_key in expected) {
		if (!Object.is(expected[_key], received[_key])) errors.push(`Expected value of "${_key}" doesn't match received value`)
	}
	if (errors.length > 0) return errors
	return [];
}

module.exports = e;