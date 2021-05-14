const axios = require('axios');
const db = require("./db.client")
let logger = global.logger

const e = {}

// resultsummary, results

async function runner(_resultID, _testID) {
	const testData = await db.findOne('tests', { _id: _testID })
	logger.debug(`${_resultID} :: Test has ${testData.tests.length} steps`)
}


e.run = async (_testID) => {
	const resultID = Date.now()
	logger.info(`Generated ${resultID} for running ${_testID}`)
	runner(resultID, _testID)
	return { resultID }
};

module.exports = e