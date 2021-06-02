const config = require("./config")
const log4js = require("log4js")
log4js.configure(config.logging.options)
let version = require("./package.json").version
let logger = log4js.getLogger(`[Holden ${version}]`)
logger.level = config.logging.loglevel
global.logger = logger

const db = require('./lib/db.client');

const transformer = require("./runner/transformer")

let data = {
	"_id": "60a896e2ad16052b2d774054",
	"name": "Login",
	"request": {
		"body": {
			"password": "123123123{{",
			"username": "jerry@appveen.com{{}}"
		},
		"headers": {
			"content-type": "application/json; charset=utf-8",
			'authorization': "JWT {{step(2).response.data.token}}",
			'username': "USERNAME {{step(2).response.data.username}}",
		},
		"method": "POST",
		"concat": "{{step(2).response.status}} - {{step(2).response.statusText}}",
		"responseCode": 200,
		"uri": "/api/a/rbac/login"
	},
	"array": [
	"{{test('Login Test').step(1).response.data.fqdn}}",
	"{{test('Login Test').step(1).response.headers.host}}"
	],
	"url": "https://staging.appveen.com"
}

async function init () {
	await db.init()
	console.clear();
	console.log("\n\n *********************************")
	// console.log(data)
	data = await transformer("1621661226791", data)
	console.log(data)
	console.log("\n\n\n END")
}
init();