const crypto = require('crypto')
const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const apiClient = require('../lib/api.client')

let schema = require("../schema/user.schema")

const userCRUD = new MongooseExpressMiddleware("user", schema, null)

const jwtSecret = require("../config").jwt
const tokenExpiry = require("../config").tokenExpiry;

let logger = global.logger

router.get("", userCRUD.index)
router.get("/:id", userCRUD.show)
router.delete("/:id", userCRUD.destroy)

router.post("", async (_req, _res) => {
	try {
		const data = _req.body;

		if (!data.username) return apiClient.handleError(Error("Username missing"), _res)
		if (!data.password) return apiClient.handleError(Error("Password missing"), _res)

		data._id = data.username;
		data.salt = Date.now().toString()
		data.password = crypto.createHmac('sha256', data.salt).update(data.password).digest('base64');

		let savedData = await userCRUD.model(data).save()
		_res.json(savedData)
	} catch (err) {
		apiClient.handleError(err, _res)
	}
});

router.put("/:id", async (_req, _res) => {
	try {
		const data = _req.body;
		const userID = _req.params.id;

		if (!data.password) return apiClient.handleError(Error("Password missing"), _res)

		let user = await userCRUD.model.findOne({ _id: userID }).exec()
		if (!user) return apiClient.handleError(Error("Invalid request"), _res)
		if (user._id != _req.user && _req.user != 'admin') return apiClient.handleError(Error("You are not authorised to change the password"), _res)

		user.salt = Date.now().toString()
		user.password = crypto.createHmac('sha256', user.salt).update(data.password).digest('base64');
		await userCRUD.model.updateOne({ _id: userID }, user)

		let savedData = await userCRUD.model.findOne({ _id: userID })
		_res.json(savedData)
	} catch (err) {
		apiClient.handleError(err, _res)
	}
})

router.post("/login", async (_req, _res) => {
	try {
		const data = _req.body;
		logger.trace(`Login payload :: ${JSON.stringify(data)}`);

		if (!data.username) return apiClient.handleError(Error("Username missing"), _res)
		if (!data.password) return apiClient.handleError(Error("Password missing"), _res)

		let savedData = await userCRUD.model.findOne({ _id: data.username })

		calculatedPassword = crypto.createHmac('sha256', savedData.salt).update(data.password).digest('base64');
		if (savedData.password != calculatedPassword) return apiClient.handleError(Error("Invalid credentials"), _res)

		const token = jwt.sign({ username: data.username }, jwtSecret, { expiresIn: tokenExpiry })
		_res.json({ token: token })
	} catch (_err) {
		apiClient.handleError(Error("Invalid credentials"), _res)
	}
})

// TODO: Implement token invalidation
// router.delete("/logout", async (_req, _res) => {
// 	try {
// 		let response = await apiClient.logout("https://cloud.appveen.com", _req)
// 		_res.json(response)
// 	} catch (_err) {
// 		apiClient.handleError(_err, _res)
// 	}
// })

module.exports = router