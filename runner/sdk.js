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

async function tokenizer(data) {
	let tokenizedData = {}
	logger.debug(`SDK :: tokenizer :: ${data}`)
	let firstSplit = data.split("{{")
	console.log(firstSplit)
	let finalString = ""
	await firstSplit.reduce(async (previous, token) => {
		if(token.indexOf("}}") == -1 ) {
			finalString += token
			return
		}
		let subTokens = token.split("}}")
		// console.log("subTokens ->", subTokens)
		let functionType = availableFunctionsTypes.find(fnType => subTokens[0].startsWith(fnType))
		subTokens[0] = functionType
		finalString += subTokens.join("")
	}, '')
	console.log(`finalString :: ${finalString}`)
	return finalString
}

async function containsHandlebar(stringData) {
	if( stringData.indexOf("{{") == -1 || stringData.indexOf("}}") == -1 ) return null
	let functionType = await tokenizer(stringData)
	if(!functionType) return null
	return functionType
};

function findData(path, json) {
	path.split(".").forEach(pathToken => {
		if(json && json[pathToken]) json = json[pathToken]
		else json = null
	})
	return json
}

sdk.step = async (testID, step) => {
	let path = null
	logger.debug(`SDK :: step() :: ${testID}, ${step}, ${path}`)
	let data = await db.findOne('data', {_id: {testID, step}})
	data = findData(path, data)
	logger.trace(`SDK :: step() :: ${data}`)
	return data
}

e.parseAndFill = async (testID, incomingData) => {
	const typeOfdata = validators.whatIsThis(incomingData)
	logger.trace(`SDK :: parseAndFill() :: Type ${typeOfdata} :: ${incomingData}`)
	if(typeOfdata > 3) incomingData = incomingData.toString()
	
	let functionType = await containsHandlebar(incomingData)
	
	if(!functionType) return incomingData
	
	logger.debug(`SDK :: parseAndFill() :: function ${JSON.stringify(functionType)}`)
	// let data = await sdk[functionType](testID, incomingData)
	return functionType
}

module.exports = e
