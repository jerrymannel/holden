"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"data": {
		"type": "String",
		"required": true
	}
}

module.exports = Mongoose.Schema(definition)