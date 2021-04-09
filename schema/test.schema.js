"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"url": ["String"],
	"tests": [
		{
			"delimiters": {
				"type": "Array",
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