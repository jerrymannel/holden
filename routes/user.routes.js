const express = require('express');
const router = express.Router();

const apiClient = require('../lib/api.client')

let logger = global.logger;

router.post("/login", async (_req, _res) => {
	try {
		let response = await apiClient.login("https://cloud.appveen.com", _req.body)
		_res.json(response)
	} catch (_err) {
		apiClient.handleError(_err, _res)
	}
})

router.delete("/logout", async (_req, _res) => {
	try {
		let response = await apiClient.logout("https://cloud.appveen.com", _req)
		_res.json(response)
	} catch (_err) {
		apiClient.handleError(_err, _res)
	}
})

module.exports = router