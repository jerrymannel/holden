const validators = require("./validators")
const sdk = require("./sdk")

const e = {}

const logger = global.logger

async function fixJSON(testID, jsonData) {
	logger.trace(`Function called :: fixJSON()`)
	const data = { ...jsonData }
	const dataKeys = Object.keys(data)
	await dataKeys.reduce(async (previous, key) => {
		await previous
		const typeOfData = validators.whatIsThis(data[key])
		logger.trace(`fixJSON() :: ${key}, ${jsonData[key]}, ${typeOfData}`)
		if (typeOfData == 1) data[key] = await fixJSON(testID, data[key])
		else if (typeOfData == 2) data[key] = await fixArray(testID, data[key])
		else data[key] = await fixString(testID, data[key])
	}, Promise.resolve())
	return data
}

async function fixArray(testID, arrayData) {
	logger.trace(`Function called :: fixArray()`)
	let data = { ...arrayData }
	await data.reduce(async (previous, arrayData) => {
		await previous
		const typeOfData = validators.whatIsThis(arrayData)
		logger.trace(`fixArray() :: ${arrayData}, ${typeOfData}`)
		if (typeOfData == 1) arrayData = await fixJSON(testID, arrayData)
		else if (typeOfData == 2) arrayData = await fixArray(testID, arrayData)
		else arrayData = await fixString(testID, arrayData)
	}, Promise.resolve())
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

async function fixString(testID, incomingData) {
	logger.trace(`Function called :: fixString()`)
	const incomingDataType = validators.whatIsThis(incomingData)
	if(validators.whatIsThis(incomingData) > 3) incomingData = incomingData.toString()
	const sdkFunction = containsHandlebar(incomingData)
	if(sdkFunction) {
		logger.debug(`fixString() :: ${incomingData}, ${sdkFunction}`)
		return await sdk.sdk[sdkFunction](testID, 2, "response.data.token")
	}
	return incomingData
}

e.fillThePlaceholders = async (testID, data) => {
	let typeOfData = validators.whatIsThis(data)
	if (typeOfData == 1) data = await fixJSON(testID, data)
	else if (typeOfData == 2) data = await fixArray(testID, data)
	else data = await fixString(testID, data)
	return data
}

module.exports = e