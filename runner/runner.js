const axios = require('axios');
const db = require("../lib/db.client")
const compare = require("./validators")
const transformer = require("./transformer")
let logger = global.logger

const e = {}

async function makeAPICall(_testID, _data) {
	const decoratorText = `${_data.resultID} : ${_data.name} : ${_data.step} : ${_data.test.name}`
	logger.debug(`${decoratorText} :: API :: ${_data.test.request.method} ${_data.test.url}${_data.test.request.uri}`);
	let response = null;
	const options = {
		url: `${_data.test.url}${_data.test.request.uri}`,
		method: _data.test.request.method,
		params: _data.test.request.params,
		headers: _data.test.request.headers,
		data: _data.test.request.data,
		timeout: 10000,
		validateStatus: () => true
	};
	try {
		return await axios(options)
	} catch (error) {
		logger.error(error.message)
		return { statusText: error.message, response: {} }
	}
}

function runValidations(_data){
	const decoratorText = `${_data.resultID} : ${_data.name} : ${_data.step} : ${_data.test.name}`
	let headerValidations = []
	let bodyValidations = []
	if (_data.test.response.headers) headerValidations = compare.compareJSON(_data.test.response.headers, _data.response.headers)
	if (_data.test.response.data) bodyValidations = compare.compareJSON(_data.test.response.data, _data.response.data)
	logger.trace(`${decoratorText} : ${headerValidations.join(", ")}`)
	logger.trace(`${decoratorText} : ${bodyValidations.join(",")}`)
	if(headerValidations.length > 0 ) {
		logger.error(`${decoratorText} : Header errors - ${headerValidations.length}`)
		_data['status'] = 'FAIL'
		_data["validationErrors"]["headers"] = headerValidations
	}
	if(bodyValidations.length > 0 ) {
		logger.error(`${decoratorText} : Body errors - ${bodyValidations.length}`)
		_data['status'] = 'FAIL'
		_data["validationErrors"]["body"] = bodyValidations
	}
	return _data
}

async function updateResult(_data, _response){
	const decoratorText = `${_data.resultID} : ${_data.name} : ${_data.step} : ${_data.test.name}`
	if(_response.status < 400 ) {
		logger.info(`${decoratorText} :: Status code matches`)
		_data['status'] = 'PASS'
		delete _response.config
		delete _response.request
	}
	else {
		logger.info(`${decoratorText} :: FAIL :: ${_response.statusText}`)
		_data['status'] = 'FAIL'
		delete _response.config
		delete _response.request
	}
	_data['response'] = _response;
	_data["validationErrors"] = {}
	
	_data = runValidations(_data)
	
	_data['_id'] = {
		resultID: _data.resultID,
		testID: _data.testID,
		step: _data.step
	}

	_data["executionTime"] = new Date()
	await db.upsertDocument('results', _data._id, _data)
	let testData = {
		_id: {
			testID: _data.testID,
			step: _data.step
		},
		request: _data.test.request,
		response: _data.response,
		executionTime: new Date()
	}
	await db.upsertDocument('data', testData._id, testData)
}

async function generateSummary(_resultID, _testID) {
	const aggregationQuery = [{
			$match: { "_id.resultID":_resultID }
		}, {
			$project: { status:1, step:1 }
		}, {
			$group: {
  			_id: "$_id.resultID",
  			status: { $addToSet: { step: "$step", status: "$status" }
  		}
		}
	}]
	const summaryResult = await (await db.aggregate('results', aggregationQuery)).toArray()
	logger.trace(`${_resultID} :: Summary aggregate :: ${JSON.stringify(summaryResult)}`)
	if (summaryResult.length < 1) {
		logger.error(`${_resultID} : Unable to generate summary`)
		return
	}
	const summary = summaryResult[0]
	summary["testID"] = _testID
	summary["executionTime"] = new Date()
	summary.status.sort((prev, curr) => prev.step - curr.step)
	logger.trace(`${_resultID} :: Summary :: ${JSON.stringify(summary)}`)
	await db.insertDocument('resultsummaries', summary)
	return summary
}

async function runner(_resultID, _testID) {
	const testData = await db.findOne('tests', { _id: _testID })
	logger.debug(`${_resultID} :: Test has ${testData.tests.length} steps`)
	await testData.tests.reduce(async (_previous, _test, _index) => {
		await _previous
		let data = {
			resultID: _resultID,
			testID: _testID,
			name: testData.name,
			step: _index + 1,
			test: _test,
		}
		data.test = await transformer.transformTest(_testID, data.test)
		let response = await makeAPICall(_testID, data)
		await updateResult(data, response)
	}, Promise.resolve())
}


e.run = async (_testID) => {
	const resultID = Date.now()
	logger.info(`Generated runID ${resultID} for running test ${_testID}`)
	await runner(resultID, _testID)
	const result = await generateSummary(resultID, _testID)
	return result
};

module.exports = e