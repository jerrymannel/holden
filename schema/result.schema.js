"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"test": "Object",
	"response": "Object",
	"resultID": {
		"type": "Number",
		"sparse": true
	},
	"step": {
		"type": "Number",
		"sparse": true
	},
	"executionTime": "Date",
	"status": {
		"type": "String",
		"enum": ["PASS", "FAIl"],
		"sparse": true
	},
	"validationErrors": "Object"
}

module.exports = Mongoose.Schema(definition)