const axios = require('axios');
const db = require("./db.client")
const compare = require("./data.validators")
let logger = global.logger

const e = {}

async function makeAPICall(_data) {
	const decoratorText = `${_data.resultID} : ${_data.name} : ${_data.step} : ${_data.test.name}`
	logger.debug(`${decoratorText} :: API :: ${_data.test.request.method} ${_data.test.url}${_data.test.request.uri}`);
	let response = null;
	const options = {
		url: `${_data.test.url}${_data.test.request.uri}`,
		method: _data.test.request.method,
		params: _data.test.request.params,
		headers: _data.test.request.headers,
		data: _data.test.request.body,
		timeout: 1000,
		validateStatus: () => true
	};
	// if (_payload.request.body) options['body'] = _payload.request.body;
	try {
		response = await axios(options);
		_data['status'] = 'PASS'
		_data['status'] = 'PASS'
		delete response.config
		delete response.request
		if(response.status < 400 ) logger.info(`${decoratorText} :: PASS`)
		else {
			logger.info(`${decoratorText} :: FAIL :: ${response.statusText}`)
			_data['status'] = 'FAIL'
		}
		_data['response'] = response;
		_data['_id'] = {
			resultID: _data.resultID,
			testID: _data.testID,
			step: _data.step
		}
		let headerValidations = null
		let bodyValidations = null
		if (_data.test.response.headers) headerValidations = compare.compareJSON(_data.test.response.headers, _data.response.header)
		if (_data.test.response.body) headerValidations = compare.compareJSON(_data.test.response.body, _data.response.data)
		logger.info(headerValidations)
		logger.info(bodyValidations)
	} catch (error) {
		logger.error(error.message)
		_data['status'] = 'FAIL'
		_data['response'] = {
			statusText: error.message,
			response: null
		}
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
		return await makeAPICall(data)
	}, Promise.resolve())

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
	// const aggregateResult = 
	const summaryResult = await (await db.aggregate('results', aggregationQuery)).toArray()
	logger.trace(`${_resultID} :: Summary aggregate :: ${JSON.stringify(summaryResult)}`)
	if (summaryResult.length < 1) return;

	const summary = summaryResult[0]
	summary["testID"] = _testID
	summary["executionTime"] = new Date()
	summary.status.sort((prev, curr) => prev.step - curr.step)
	logger.trace(`${_resultID} :: Summary :: ${JSON.stringify(summary)}`)
	await db.insertDocument('resultsummaries', summary)
}


e.run = async (_testID) => {
	const resultID = Date.now()
	logger.info(`Generated runID ${resultID} for running test ${_testID}`)
	runner(resultID, _testID)
	return { resultID }
};

module.exports = e