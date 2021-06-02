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
		else data[key] = await sdk.parseAndFill(testID, data[key])
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
		else arrayData = await sdk.parseAndFill(testID, arrayData)
	}, Promise.resolve())
	return data
}

module.exports = async (testID, data) => {
	logger.debug(`${testID} :: Transform data called`)
	let typeOfData = validators.whatIsThis(data)
	if (typeOfData == 1) data = await fixJSON(testID, data)
	else if (typeOfData == 2) data = await fixArray(testID, data)
	else return await sdk.parseAndFill(testID, data)
	return data
}