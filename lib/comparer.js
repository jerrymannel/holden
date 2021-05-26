
function whatIsThis(_d) {
  if (Object.prototype.toString.call(_d) == "[object Object]") return 1;
  if (Object.prototype.toString.call(_d) == "[object Array]") return 2;
  if (Object.prototype.toString.call(_d) == "[object String]") return 3;
  if (Object.prototype.toString.call(_d) == "[object Number]") return 4;
  if (Object.prototype.toString.call(_d) == "[object Boolean]") return 5;
  return 0;
}

function flattenJSON(_parent, _json) {
	let data = {}
	for(let _key in _json){
		switch (whatIsThis(_json[_key])) {
			case 1: 
				data = {...data, ...flattenJSON(`${_parent}.${_key}`, _json[_key])}
				break;
			case 2: 
				data = {...data, ...flattenArray(`${_parent}.${_key}`, _json[_key])}
				break;
			default: 
				data[`${_parent}.${_key}`] = _json[_key]
				break;
		}
	}
	return data
}

function flattenArray(_parent, _array) {
	let data = {}
	_array.forEach((_data, _index) => {
		switch (whatIsThis(_data)) {
			case 1: 
				data = {...data, ...flattenJSON(`${_parent}.${_index}`, _data)}
				break;
			case 2: 
				data = {...data, ...flattenArray(`${_parent}.${_index}`, _data)}
				break;
			default: 
				data[`${_parent}.${_index}`] = _data
				break;
		}
	})
	return data
}

function flatten(_json){
	let data = {}
	for(let _key in _json){
		switch (whatIsThis(_json[_key])) {
			case 1: 
				data = {...data, ...flattenJSON(_key, _json[_key])}
				break;
			case 2: 
				data = {...data, ...flattenArray(_key, _json[_key])}
				break;
			default: 
				data[_key] = _json[_key]
				break;
		}
	}
	return data
}

function compareJSON(_expected, _received){
	const expected = flatten(_expected)
	const received = flatten(_received)
	const errors = []
	for(_key in expected){
		if (!Object.is(expected[_key], received[_key])) errors.push(`Expected value of "${_key}" doesn't match received value`)
	}
	if (errors.length > 0 ) return errors
	return null;
}

module.exports = {whatIsThis, compareJSON, flattenJSON};