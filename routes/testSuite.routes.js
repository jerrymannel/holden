const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

const apiClient = require('../lib/api.client')
const generator = require('../lib/generator')

const db = require("../lib/db.client")
const runner = require("../lib/run.tests")

let schema = require("../schema/testSuite.schema")

const testsCrud = new MongooseExpressMiddleware("testSuite", schema, null)

let logger = global.logger;

router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.put("/bulkUpdate", testsCrud.bulkUpdate)
router.delete("/bulkDelete", testsCrud.bulkDestroy)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)

router.delete("/:id", async (_req, _res) => {
	try {
		logger.debug(`Delete test suite :: ${_req.params.id}`);
		await db.deleteDocument("testsuites", { _id: _req.params.id })
		await db.deleteDocument("tests", { testSuite: _req.params.id })
		await db.deleteDocument("resultsummaries", { testSuite: _req.params.id })
		await db.deleteDocument("results", { testSuite: _req.params.id })
		_res.end();
	} catch (_err) {
		apiClient.handleError(_err, _res);
	}
})

router.post("", async (_req, _res) => {
	try {
		const data = _req.body;
		logger.trace(data);
		let response = await testsCrud.model(data).save();
		await generator.generate(response);
		_res.json(response);
	} catch (_err) {
		apiClient.handleError(_err, _res);
	}
})

router.put("/:testSuite/run", async (_req, _res) => {
	try {
		const testSuiteId = _req.params.testSuite;
		const resultSumamryId = `RUN-${testSuiteId}-${Date.now()}`
		logger.info(`Starting test run for ${testSuiteId} :: ${resultSumamryId}`);
		_res.json({ message: `${resultSumamryId} : Tests start initiated.` });
		runner.run(testSuiteId, resultSumamryId)
	} catch (_err) {
		apiClient.handleError(_err, _res);
	}
})

module.exports = router