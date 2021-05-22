const req = require('request-promise');
const axios = require('axios');
const config = require('../config');

let logger = global.logger;

let e = {};

e.handleError = (_err, _res) => {
	if (_err.statusCode) return _res.status(_err.statusCode).json(_err.error)
	_res.status(400).json({ "message": _err.message })
}

e.login = (_url, _data) => {
	return req({
		uri: `${_url}${config.apis.login}`,
		method: 'POST',
		json: true,
		body: _data,
	});
};

e.logout = (_url, _req) => {
	return req({
		uri: `${_url}${config.apis.logout}`,
		method: 'DELETE',
		json: true,
		headers: {
			'Authorization': _req.get('Authorization')
		}
	});
};

e.check = (_url, _req) => {
	return req({
		uri: `${_url}${config.apis.check}`,
		method: 'GET',
		json: true,
		headers: {
			'Authorization': _req.get('Authorization')
		}
	});
}

/**
 * 
 * @param {String} _token 
 * @param {String} _method 
 * @param {String} _url 
 * @param {String} _type 
 * @param {Object} _qs 
 * @param {Object} _data 
 * @returns 
 */
e.call = async (_token, _method, _url, _type, _qs, _data) => {
	logger.debug(`Outbound call :: ${_method} ${_url}`);
	const options = {
		uri: `${_url}${config.apis[_type]}`,
		method: _method,
		qs: _qs,
		json: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	};
	if (_data) options['body'] = _data;
	return req(options);
};

/**
 * 
 * @param {String} _method 
 * @param {String} _url 
 * @param {String} _headers
 * @param {Object} _qs 
 * @param {Object} _data 
 * @returns 
 */
e.callExternalAPI = async (_payload) => {
	logger.debug(`Outbound call :: ${_payload.request.method} ${_payload.url}${_payload.request.uri}`);
	const options = {
		url: `${_payload.url}${_payload.request.uri}`,
		method: _payload.request.method,
		params: _payload.request.params,
		headers: _payload.request.headers,
		data: _payload.request.body,
		validateStatus: (_status) => {
			return true
		}
	};
	// if (_payload.request.body) options['body'] = _payload.request.body;
	return axios(options);
};

module.exports = e;