const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

const db = require("../lib/db.client")

let schema = require("../schema/test.schema")

const testsCrud = new MongooseExpressMiddleware("tests", schema, null)

router.post("", testsCrud.create)
router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)
router.delete("/:id", testsCrud.destroy)

module.exports = router