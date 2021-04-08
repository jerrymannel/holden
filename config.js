const mongodb = require("mongodb")

module.exports = {
	"db": {
		"MONGOURL": process.env.MONGOURL ? process.env.MONGOURL : 'mongodb://localhost:27017',
		"DB_NAME": process.env.DB_NAME ? process.env.DB_NAME : "holden",
		"clinetOptions": {
			"readPreference": mongodb.ReadPreference.SECONDARY_PREFERRED,
			"useUnifiedTopology": true
		}
	},
	"jwt": "iaIowOtVZcWxeD9UdltaZi77rZ7TAfPTJAE0CR5Y",
	"tokenExpiry": process.env.TOKEN_EXPIRY || 3600,
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
	}
}