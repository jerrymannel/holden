const crypto = require('crypto');

const db = require("./db.client")
let logger = global.logger

async function init() {
	let adminUser = await db.findOne("users", { _id: "admin" })
	if (!adminUser) {
		logger.info("Initilising admin user")
		const salt = Date.now().toString()
		const hmac = crypto.createHmac('sha256', salt).update(`admin123`).digest('base64');
		const adminUser = {
			_id: "admin",
			password: hmac,
			salt: salt
		}
		await db.insertDocument('users', adminUser)
		logger.info("Admin user created.")
	}
}

module.exports = init;