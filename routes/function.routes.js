const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/functions.schema")

const functionsCRUD = new MongooseExpressMiddleware("function", schema, null)

router.post("", functionsCRUD.create)
router.get("", functionsCRUD.index)
router.get("/:id", functionsCRUD.show)
router.put("/:id", functionsCRUD.update)
router.delete("/:id", functionsCRUD.destroy)

module.exports = router