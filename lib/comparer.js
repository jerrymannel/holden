
function whatIsThis(_d) {
  if (Object.prototype.toString.call(_d) == "[object Object]") return 1;
  if (Object.prototype.toString.call(_d) == "[object Array]") return 2;
  if (Object.prototype.toString.call(_d) == "[object String]") return 3;
  if (Object.prototype.toString.call(_d) == "[object Number]") return 4;
  if (Object.prototype.toString.call(_d) == "[object Boolean]") return 5;
  return 0;
}


function flattenJSON(_parent, _input){
	let keys = Object.keys(_input)
	keys.forEach(_key => {
		if(whatIsThis(_input[_key]) < 3 ) {
			let newKeys = flattenJSON(_key, _input[_key])
			keys = keys.concat(newKeys)
		}
	})
	if(_parent) keys = keys.map(_k => `${_parent}.${_k}`)
	return keys
}

function compareJSON(_original, _expected){
	const original = flattenJSON(null, _original)
	console.log(original)
	// const expected = flattenJSON(null, _expected)
	const keys = Object.keys(_original)
	// keys.forEach(_key => {
	// 	if (!Object.is(_original[_key], _expected[_key])) return Error("Expected value doesn't match")
	// 	else console.log(_key, "NO")
	// })
}

const saved = {
  "date": "Sat, 22 May 2021 05:27:10 GMT",
  "content-type": "application/json; charset=utf-8",
  "content-length": "192",
  "connection": "close",
  "x-powered-by": "Express",
  "txnid": "1tvEjt",
  "access-control-allow-headers": "content-type,authorization,access-control-allow-methods,access-control-allow-origin,*",
  "access-control-allow-methods": "GET, POST, OPTIONS, PUT, DELETE",
  "etag": "W/\"c0-OpLhDez1qz2LjXpTXCAiV9jQ4ss\"",
  "strict-transport-security": "max-age=15724800; includeSubDomains",
  "access-control-allow-origin": "*",
  "access-control-allow-credentials": "true",
  "sec_header_access_control_allow_methods": "GET, POST, OPTIONS, PUT, DELETE",
  "sec_header_access_control_allow_headers": "content-type,authorization,access-control-allow-methods,access-control-allow-origin,*",
  "sec_header_access_control_allow_origin": "staging.appveen.com",
  "sec_header_cache_control": "no-cache",
  "sec_header_content_security_policy": "'default-src * data: ''unsafe-eval'' ''unsafe-inline'''",
  "sec_header_server": "data.stack/1.0.1",
  "sec_header_strict_transport_security": "max-age=31536000; includeSubDomains",
  "sec_header_x_content_type_option": "nosniff",
  "sec_header_x_frame_option": "sameorigin",
  "sec_header_x_powered_by": "data.stack/1.0.1",
  "sec_header_x_xss_protection": "1; mode=block",
  "12sec_header_x_xss_protection": "1; mode=block",
  "access": {
  	"access-control-allow-origin": "*",
  	"access-control-allow-credentials": "true",
  }
}

const response = {
  "date": "Mon, 24 May 2021 15:19:41 GMT",
  "content-type": "application/json; charset=utf-8",
  "content-length": "192",
  "connection": "close",
  "x-powered-by": "Express",
  "txnid": "Z27CdCT",
  "access-control-allow-headers": "content-type,authorization,access-control-allow-methods,access-control-allow-origin,*",
  "access-control-allow-methods": "GET, POST, OPTIONS, PUT, DELETE",
  "etag": "W/\"c0-OpLhDez1qz2LjXpTXCAiV9jQ4ss\"",
  "strict-transport-security": "max-age=15724800; includeSubDomains",
  "access-control-allow-origin": "*",
  "access-control-allow-credentials": "true",
  "sec_header_access_control_allow_methods": "GET, POST, OPTIONS, PUT, DELETE",
  "sec_header_access_control_allow_headers": "content-type,authorization,access-control-allow-methods,access-control-allow-origin,*",
  "sec_header_access_control_allow_origin": "staging.appveen.com",
  "sec_header_cache_control": "no-cache",
  "sec_header_content_security_policy": "'default-src * data: ''unsafe-eval'' ''unsafe-inline'''",
  "sec_header_server": "data.stack/1.0.1",
  "sec_header_strict_transport_security": "max-age=31536000; includeSubDomains",
  "sec_header_x_content_type_option": "nosniff",
  "sec_header_x_frame_option": "sameorigin",
  "sec_header_x_powered_by": "data.stack/1.0.1",
  "sec_header_x_xss_protection": "1; mode=block"
}

compareJSON(saved, response)

module.exports = {whatIsThis, compareJSON, flattenJSON};