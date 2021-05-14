const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

const db = require("../lib/db.client")
const apiClient = require("../lib/api.client")
const runner = require('../lib/runner')

let logger = global.logger

let schema = require("../schema/test.schema")

schema.pre('save', function (next) {
	if (!this._id) this._id = Date.now()
	next()
})

const testsCrud = new MongooseExpressMiddleware("tests", schema, null)

router.post("", testsCrud.create)
router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)
router.delete("/:id", testsCrud.destroy)

//  runs a steps and gets the output
router.post("/run", (_req, _res) => {
	let body = _req.body;
	apiClient.callExternalAPI(body)
		.then(_d => {
			delete _d.config
			delete _d.request
			_res.json(_d)
		})
		.catch(_e => {
			console.log(_e)
			_res.status(500).json({ 'message': 'Error requesting API' })
		})
})

// execute
router.post('/runTest/:id', async (_req, _res) => {
	logger.info(`Running test ${_req.params.id}`)
	let resultID = await runner.run(_req.params.id)
	_res.status(202).json(resultID)
})

module.exports = router