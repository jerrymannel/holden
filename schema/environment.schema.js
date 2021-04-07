"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"url": "String",
	"username": "String",
	"password": "String",
	"app": "String",
	"dataservices": [{
		"type": "Object"
	}]
}

module.exports = Mongoose.Schema(definition)