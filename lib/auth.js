const jwt = require('jsonwebtoken')
const config = require('../config')

const db = require('./db.client')

let logger = global.logger

const e = {};

e.check = (_req) => {
	let authorizationHeader = _req.get("Authorization")
	logger.trace(`Auth check :: ${authorizationHeader}`)
	if (!authorizationHeader) throw Error("Missing auth header")

	authorizationHeader = authorizationHeader.split(` `)
	logger.trace(`Auth check :: ${authorizationHeader}`)
	if (authorizationHeader.length != 2) throw Error("Missing token")
	if (authorizationHeader[0] != 'Bearer') throw Error('Invalid format')

	authorizationHeader = authorizationHeader[1]
	let data = jwt.verify(authorizationHeader, config.jwt)
	logger.debug(`Auth check :: ${JSON.stringify(data)}`)
	return data.username;
}

module.exports = e;