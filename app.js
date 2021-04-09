
const express = require("express")
let app = express()
let port = process.env.PORT || 8080

const jwt = require('jsonwebtoken');

const config = require("./config")
const log4js = require("log4js")
log4js.configure(config.logging.options)
let version = require("./package.json").version
let logger = log4js.getLogger(`[Holden ${version}]`)
logger.level = config.logging.loglevel
global.logger = logger

const db = require('./lib/db.client');
const init = require('./lib/init')

let environmentRouter = require("./routes/environment.routes")
let testRouter = require("./routes/test.routes")
let functionRouter = require("./routes/function.routes")
let testSuiteRouter = require("./routes/testSuite.routes")
let resultsRouter = require("./routes/result.routes")
let resultSummaryRouter = require("./routes/resultSummary.routes")
let userRouter = require("./routes/user.routes")

let auth = require('./lib/auth')

app.use(express.json())
app.use((_req, _res, _next) => {
	logger.info(`${_req.method} ${_req.path}`)
	_next()
})

app.get("/api/version", (_req, _res) => _res.json({ version: version }))

app.use(async (_req, _res, _next) => {
	// deliberately kept the following lines like this
	if (process.env.LOG_LEVEL == "debug" && process.env.AUTH_BYPASS == "true") {
		logger.debug("Auth Bypassed")
		return _next()
	}
	if (_req.path.endsWith('login') || _req.path.endsWith('logout')) return _next()

	try {
		_req["user"] = auth.check(_req)
		_next()
	} catch (_err) {
		logger.error(_err.message)
		return _res.status(403).json({ "message": "Invalid session" })
	}
})

app.use("/api/user", userRouter);
app.use("/api/environment", environmentRouter);
app.use("/api/test", testRouter);
app.use("/api/function", functionRouter);
app.use("/api/testsuite", testSuiteRouter);
app.use("/api/result", resultsRouter);
app.use("/api/resultsummary", resultSummaryRouter);

// Mongoose.set("debug", "true")

(async () => {
	await db.init()
	app.listen(port, () => {
		logger.info("Server started on port " + port)
		init();
	})
})();