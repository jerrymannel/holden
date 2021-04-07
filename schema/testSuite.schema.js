"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"environment": "String",
	"app": "String",
	"dataservice": "String",
	"dataserviceName": "String",
	"api": "String",
	"testEachAttribute": {
		"type": "Boolean",
		"default": "true"
	},
	"users": [{
		"username": "String",
		"password": "String",
		"operation": {
			"type": "String",
			"enum": ["ALL", "POST", "GET", "PUT", "DELETE", "APPROVE"]
		}
	}],
	"testParams": "Object"
}

module.exports = Mongoose.Schema(definition)