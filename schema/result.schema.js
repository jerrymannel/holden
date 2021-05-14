"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"request": "Object",
	"response": "Object",
	"resultSumaryID": {
		"type": "Number",
		"sparse": true
	},
	"stepNo.": {
		"type": "Number",
		"sparse": true
	},
	"startDate": "Date",
	"endDate": "Date",
	"status": {
		"type": "String",
		"enum": ["PASS", "FAIl", "PENDING"],
		"default": "PENDING",
		"sparse": true
	}
}

module.exports = Mongoose.Schema(definition)