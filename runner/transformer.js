const validators = require("./validators")
const sdk = require("./sdk")

const e = {}

const logger = global.logger

function fixJSON(testID, jsonData) {
	logger.trace(`Function called :: fixJSON()`)
	const data = { ...jsonData }
	const dataKeys = Object.keys(data)
	dataKeys.forEach(key => {
		const typeOfData = validators.whatIsThis(data[key])
		if (typeOfData == 1) data[key] = fixJSON(testID, data[key])
		else if (typeOfData == 2) data[key] = fixArray(testID, data[key])
		else data[key] = fixString(testID, data[key])
	})
	return data
}

function fixArray(testID, arrayData) {
	logger.trace(`Function called :: fixArray()`)
	let data = { ...arrayData }
	data.forEach(arrayData => {
		const typeOfData = validators.whatIsThis(arrayData)
		if (typeOfData == 1) arrayData = fixJSON(testID, arrayData)
		else if (typeOfData == 2) arrayData = fixArray(testID, arrayData)
		else arrayData = fixString(testID, arrayData)
	})
	return data
}

function containsHandlebar(stringData) {
	let flag = null;
	sdk.availableFunctionsTypes.forEach(functionType => {
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
}

function fixString(testID, incomingData) {
	logger.trace(`Function called :: fixString()`)
	const incomingDataType = validators.whatIsThis(incomingData)
	if(validators.whatIsThis(incomingData) > 3) incomingData = incomingData.toString()
	const sdkFunction = containsHandlebar(incomingData)
	if(sdkFunction) {
		logger.debug(incomingData, sdkFunction)
		sdk.sdk[sdkFunction](testID, 2)
	}
	return incomingData
}

e.fillThePlaceholders = (testID, data) => {
	let typeOfData = validators.whatIsThis(data)
	if (typeOfData == 1) data = fixJSON(testID, data)
	else if (typeOfData == 2) data = fixArray(testID, data)
	else data = fixString(testID, data)
	return data
}

module.exports = e