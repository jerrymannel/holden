const mongodb = require("mongodb")

module.exports = {
	"datastack": {
		"URL": process.env.URL || "https://localhost",
		"USERNAME": process.env.USERNAME || "admin",
		"PASSWORD": process.env.PASSWORD || "password"
	},
	"db": {
		"MONGOURL": process.env.MONGOURL ? process.env.MONGOURL : 'mongodb://localhost:27017',
		"DB_NAME": process.env.DB_NAME ? process.env.DB_NAME : "dataStackTests",
		"clinetOptions": {
			"readPreference": mongodb.ReadPreference.SECONDARY_PREFERRED,
			"useUnifiedTopology": true
		}
	},
	"logging": {
		"loglevel": process.env.LOG_LEVEL || "info",
		"options": {
			"appenders": {
				"out": {
					"type": 'stdout',
					"layout": { type: 'basic' }
				}
			},
			"categories": {
				"default": {
					"appenders": ['out'],
					"level": 'error'
				}
			}
		}
	},
	"apis": {
		'login': `/api/a/rbac/login`,
		'logout': `/api/a/rbac/logout`,
		'check': `/api/a/rbac/check`,
		'app': `/api/a/rbac/app`,
		'sm': `/api/a/sm/service`
	}
}