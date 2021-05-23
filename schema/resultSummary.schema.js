"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"testId": "String",
	"executionTime": "Date",
	"status": {
		"step": "Number",
		"status": {
			"type": "String",
			"enum": ["Pending", "Completed"]
		}
	}
}

module.exports = Mongoose.Schema(definition)