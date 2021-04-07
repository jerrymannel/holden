const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/environment.schema")

const envCrud = new MongooseExpressMiddleware("environments", schema, null)

const config = require("../config")
const apiClient = require("../lib/api.client");

let logger = global.logger

router.post("", envCrud.create)
router.get("", envCrud.index)
router.get("/:id", envCrud.show)
router.put("/:id", envCrud.update)
router.delete("/:id", envCrud.destroy)

router.get("/fetch/apps", async (_req, _res) => {
	try {
		let data = {
			url: _req.query.url,
			username: _req.query.username,
			password: _req.query.password
		}
		logger.trace(JSON.stringify(data))
		let loginResponse = await apiClient.login(data.url, data)
		let apps = await apiClient.call(loginResponse.token, "GET", data.url, "app", { select: "_id" }, {})
		logger.trace(JSON.stringify(apps))
		_res.json(apps.map(_app => _app._id))
	} catch (_err) {
		logger.error(_err);
		apiClient.handleError(_err, _res)
	}
})

router.get("/fetch/dataservices", async (_req, _res) => {
	try {
		let data = {
			url: _req.query.url,
			username: _req.query.username,
			password: _req.query.password,
			app: _req.query.app
		}
		logger.trace(JSON.stringify(data))
		let loginResponse = await apiClient.login(data.url, data)
		let qs = {
			filter: { app: data.app },
			sort: "name"
		}
		logger.trace(JSON.stringify(qs))
		let dataService = await apiClient.call(loginResponse.token, "GET", data.url, "sm", qs, {})
		logger.trace(JSON.stringify(dataService))
		_res.json(dataService)
	} catch (_err) {
		logger.error(_err);
		apiClient.handleError(_err, _res)
	}
})

module.exports = router