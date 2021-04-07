"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"testSet": "String",
	"testSuite": "String",
	"test": "String",
	"app": "String",
	"dataserviceName": "String",
	"api": "String",
	"method": "String",
	"responseCode": "Number",
	"dataSet": "String",
	"generatedOn": "Date",
	"json": "Boolean",
	"data": "Object"
}

module.exports = Mongoose.Schema(definition)