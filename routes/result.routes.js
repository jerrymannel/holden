const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/result.schema")

const resultsCrud = new MongooseExpressMiddleware("results", schema, null)

router.get("", resultsCrud.index)
router.get("/bulkShow", resultsCrud.bulkShow)
router.delete("/bulkDelete", resultsCrud.bulkDestroy)
router.get("/:id", resultsCrud.show)
router.delete("/:id", resultsCrud.destroy)

module.exports = router