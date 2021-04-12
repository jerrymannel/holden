"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"name": {
		"type": "String",
		"require": true,
		"unique": true,
	},
	"url": ["String"],
	"tests": [
		{
			"delimiters": {
				"type": "Object",
				"default": ["<%", "%>"]
			},
			"endpoint": "String",
			"name": "String",
			"request": {
				"method": {
					"type": "String",
					"enum": ["POST", "GET", "PUT", "DELETE"]
				},
				"url": "String",
				"headers": "Object",
				"payload": "Object",
				"payloadFile": "String",
				"responseCode": "Number",
				"saveResponse": "String"
			},
			"response": {
				"headers": "Object",
				"body": "Object",
				"bodyFile": "String",
			}
		}
	]
}

module.exports = Mongoose.Schema(definition)