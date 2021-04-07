const { date } = require('faker');
const req = require('request-promise');
const db = require("../lib/db.client")
let logger = global.logger

const e = {}

async function __createResultSummary(_testSuiteID, _resultSummaryID) {
	let testSuite = await db.findOne("testsuites", { _id: _testSuiteID });
	let numberOfTests = await db.count("tests", { testSuite: _testSuiteID });
	const data = {
		"_id": _resultSummaryID,
		"testSuite": testSuite._id,
		"startDate": new Date(),
		"tests": numberOfTests,
		"pass": 0,
		"fail": 0,
		"endpoint": testSuite.api,
		"status": "Pending"
	}
	await db.insertDocument("resultsummaries", data);
}

async function __createResult(_testSuiteID, _resultSummaryID, _test) {
	const data = {
		"_id": Date.now(),
		"resultSummary": _resultSummaryID,
		"testSuite": _testSuiteID,
		"test": _test._id,
		"startDate": new Date(),
		"status": "PENDING",
		"uri": _test.uri,
		"method": _test.method,
		"data": _test.data,
		"expectedStatus": _test.responseCode
	}
	await db.insertDocument("results", data);
	return data._id;
}

async function __updateResult(_resultSummaryID, _id, _test, _response) {
	let status = "PASS"
	let comment = null;
	const summaryUpdate = {
		"$inc": { pass: 1 }
	}
	if (_test.responseCode != _response.statusCode) {
		status = "FAIL"
		comment = _response.body
		summaryUpdate["$inc"] = { fail: 1 }
	}
	const data = {
		"endDate": new Date(),
		"status": _test.responseCode == _response.statusCode ? "PASS" : "FAIL",
		"comment": comment,
		"responseHeaders": _response.headers,
		"response": _response.body,
		"responseStatus": _response.statusCode
	}
	await db.updateDocument("results", _id, data);
	await db.rawUpdateDocument("resultsummaries", _resultSummaryID, summaryUpdate);
}

async function login(_test) {
	return req({
		uri: _test.loginURL,
		method: 'POST',
		json: true,
		body: _test.user,
	});
};

async function check(_token, _test) {
	return req({
		uri: _test.checkURL,
		method: 'GET',
		json: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	});
};

async function logout(_token, _test) {
	return req({
		uri: _test.logoutURL,
		method: 'DELETE',
		json: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	});
};

async function makeAPICall(_token, _test, _resultId, _resultSummaryID) {
	logger.debug(`Outbound call :: ${_test.method} ${_test.uri}`);
	const options = {
		uri: _test.uri,
		method: _test.method,
		json: true,
		resolveWithFullResponse: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	};
	if (_test.data) options['body'] = _test.data;
	await req(options)
		.then(_response => __updateResult(_resultSummaryID, _resultId, _test, _response))
		.catch(_err => __updateResult(_resultSummaryID, _resultId, _test, _err));
};

async function runner(_testSuiteID, _resultSummaryID) {
	counter = 0;
	const tokens = {}
	let cursor = await db.db.collection("tests").find({ testSuite: _testSuiteID })
		.batchSize(1)
	while (true) {
		let test = await cursor.next()
		if (test) {
			logger.info(`${_resultSummaryID} :: Running test ${test._id}`)
			// create the test result
			const resultId = await __createResult(_testSuiteID, _resultSummaryID, test);
			try {
				// CHECK token and LOGIN if required.
				if (tokens[test.method]) {
					try {
						await check(tokens[test.method], test)
						logger.debug(`${_resultSummaryID} :: ${test._id} :: CHECK OK`)
					} catch (error) {
						tokens[test.method] = null;
					}
				}
				if (!tokens[test.method]) {
					logger.debug(`${_resultSummaryID} :: ${test._id} :: No active token`)
					let loginResonse = await login(test)
					tokens[test.method] = loginResonse.token
					logger.debug(`${_resultSummaryID} :: ${test._id} :: LOGIN :: Success`)
				}

				await makeAPICall(tokens[test.method], test, resultId, _resultSummaryID)
				logger.debug(`${_resultSummaryID} :: ${test._id} :: PASS`)
			} catch (e) {
				logger.error(`${_resultSummaryID} :: ${test._id} :: ${e.message}`)
				logger.debug(`${_resultSummaryID} :: ${test._id} :: FAIL`)
				break;
			}
		} else break
	}
	await db.updateDocument("resultsummaries", _resultSummaryID, { status: "Completed" });
}

e.run = async (_testSuiteID, _resultSummaryID) => {
	_testSuiteID
	await __createResultSummary(_testSuiteID, _resultSummaryID)
	await runner(_testSuiteID, _resultSummaryID)
};

module.exports = e