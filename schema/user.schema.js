"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"password": {
		"type": "String",
		"required": true
	},
	"salt": "String",
}

module.exports = Mongoose.Schema(definition)