const db = require("../lib/db.client")
const validators = require("./validators")

const logger = global.logger

const availableFunctionsTypes = [
	"step", // step(number)....
	"test", // test(testName).step(number)...
	"toString", // toString(value)
	"toInt", // toInt(value)
	"toBool", // toBool(value)
]

const sdk = {}
const e = {}

async function tokenizer(testID, data) {
	let tokenizedData = {}
	logger.debug(`${testID} :: SDK :: tokenizer() :: ${data}`)
	let firstSplit = data.split("{{")
	// console.log(firstSplit)
	let finalString = ""
	await firstSplit.reduce(async (previous, token) => {
		if(token.indexOf("}}") == -1 ) {
			finalString += token
			return
		}
		let subTokens = token.split("}}")
		// console.log("subTokens ->", subTokens)
		let functionType = availableFunctionsTypes.find(fnType => subTokens[0].startsWith(fnType))
		logger.debug(`${testID} :: SDK :: tokenizer() :: type - ${functionType}`)
		if (functionType) subTokens[0] = await sdk[functionType](testID, subTokens[0])
		finalString += subTokens.join("")
	}, '')
	return finalString
}

function findData(path, json) {
	path.split(".").forEach(pathToken => {
		if(json && json[pathToken]) json = json[pathToken]
		else json = null
	})
	return json
}

sdk.step = async (testID, inputString) => {
	const tokenizedString = inputString.split(".")
	const step = parseInt(tokenizedString[0].split("(")[1].split(")")[0])
	tokenizedString.splice(0, 1)
	const path = tokenizedString.join(".")
	logger.debug(`${testID} :: SDK :: step() :: ${step}, ${path}`)
	let data = await db.findOne('data', {_id: {testID, step}})
	data = findData(path, data)
	logger.trace(`${testID} :: SDK :: step() :: ${data}`)
	return data
}

sdk.test = async (testID, inputString) => {
	const tokenizedString = inputString.split(".")
	const test = tokenizedString[0].split("(")[1].split(")")[0].replace(/'/ig,"")
	tokenizedString.splice(0, 1)
	const step = parseInt(tokenizedString[0].split("(")[1].split(")")[0])
	tokenizedString.splice(0, 1)
	const path = tokenizedString.join(".")
	logger.debug(`${testID} :: SDK :: test() :: ${test}, ${step}, ${path}`)
	let outgoingTestID = await db.findOne('tests', {name: test})
	outgoingTestID = outgoingTestID._id
	logger.debug(`${testID} :: SDK :: test() :: ${outgoingTestID}, ${step}, ${path}`)
	let data = await db.findOne('data', {_id: {outgoingTestID, step}})
	data = findData(path, data)
	logger.trace(`${testID} :: SDK :: test() :: ${data}`)
	return data
}

module.exports = async (testID, incomingData) => {
	const typeOfdata = validators.whatIsThis(incomingData)
	logger.trace(`SDK :: parseAndFill() :: Type ${typeOfdata} :: ${incomingData}`)
	if(typeOfdata > 3) incomingData = incomingData.toString()

	if( !incomingData ) return incomingData
	if( incomingData.indexOf("{{") == -1 || incomingData.indexOf("}}") == -1 ) return incomingData

	let functionType = await tokenizer(testID, incomingData)
	if(!functionType) return incomingData
	
	logger.trace(`SDK :: parsed response :: ${JSON.stringify(functionType)}`)
	return functionType
}