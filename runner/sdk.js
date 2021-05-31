const db = require("../lib/db.client")

const logger = global.logger

const availableFunctionsTypes = [
	"step(",
	"test(",
	"get(",
	"request(",
	"response(",
	"header(",
	"body(",
	"toInt(",
	"toBool(",
]

const sdk = {}

sdk.step = async (testID, step, path) => {
	logger.debug(`SDK :: step() :: ${testID}, ${step}, ${path}`)
	const data = await db.findOne('data', {_id: {testID, step}})
	logger.debug(data)
}

module.exports = { availableFunctionsTypes, sdk}