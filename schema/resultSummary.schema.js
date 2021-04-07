"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"testSuite": "String",
	"startDate": "Date",
	"endDate": "Date",
	"tests": "Number",
	"pass": "Number",
	"fail": "Number",
	"endpoint": "String",
	"status": {
		"type": "String",
		"enum": ["Pending", "Completed"]
	}
}

module.exports = Mongoose.Schema(definition)