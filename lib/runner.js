const axios = require('axios');
const db = require("./db.client")
let logger = global.logger

const e = {}

// resultsummary, results

async function makeAPICall(_data) {
	const decoratorText = `RunID(${_data.resultID})/Test(${_data.name}) :: ${_data.step} :: ${_data.test.name}`
	logger.info(decoratorText)
	logger.debug(`Outbound call :: ${_data.test.request.method} ${_data.test.url}${_data.test.request.uri}`);
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
			testID: _data.testID,
			step: _data.step
		}
	} catch (error) {
		logger.error(error.message)
		_data['status'] = 'FAIL'
		_data['response'] = {
			statusText: error.message
		}
	}
	await db.upsertDocument('results', _data._id, _data)
}

async function runner(_resultID, _testID) {
	const testData = await db.findOne('tests', { _id: _testID })
	logger.debug(`${_resultID} :: Test has ${testData.tests.length} steps`)
	testData.tests.reduce(async (_previous, _test, _index) => {
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
}


e.run = async (_testID) => {
	const resultID = Date.now()
	logger.info(`Generated runID ${resultID} for running test ${_testID}`)
	runner(resultID, _testID)
	return { resultID }
};

module.exports = e