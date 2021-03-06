"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"name": {
		"type": "String",
		"require": true,
		"unique": true,
	},
	"urls": ["String"],
	"tests": [
		{
			"url": "String",
			"name": "String",
			"request": {
				"method": {
					"type": "String",
					"enum": ["POST", "GET", "PUT", "DELETE"]
				},
				"uri": "String",
				"headers": "Object",
				"data": "Object",
				"responseCode": "Number"
			},
			"response": {
				"headers": "Object",
				"data": "Object",
			}
		}
	]
}

module.exports = Mongoose.Schema(definition)