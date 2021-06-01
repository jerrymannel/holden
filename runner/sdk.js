const db = require("../lib/db.client")
const validators = require("./validators")

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
const e = {}

function containsHandlebar(stringData) {
	let flag = null;
	availableFunctionsTypes.forEach(functionType => {
		if(
			stringData.indexOf("{{") > -1 &&
			stringData.indexOf("}}") > -1 &&
			stringData.indexOf(functionType) > -1
			) {
				flag = functionType.split("(")[0]
				logger.trace(`containsHandlebar() :: ${stringData}`)
			}
	})
	return flag
};

function findData(path, json) {
	path.split(".").forEach(pathToken => {
		if(json && json[pathToken]) json = json[pathToken]
		else json = null
	})
	return json
}

sdk.step = async (testID, step, path) => {
	logger.debug(`SDK :: step() :: ${testID}, ${step}, ${path}`)
	let data = await db.findOne('data', {_id: {testID, step}})
	data = findData(path, data)
	logger.trace(`SDK :: step() :: ${data}`)
	return data
}

e.parseAndFill = async (testID, incomingData) => {
	const typeOfdata = validators.whatIsThis(incomingData)
	if(typeOfdata > 3) incomingData = incomingData.toString()
	if(!containsHandlebar(incomingData)) return incomingData
	return incomingData
}

module.exports = e
