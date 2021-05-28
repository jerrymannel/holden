const { json } = require("express");
const got = require("got");
const e = require("./lib/data.validators");
const validator = require("./lib/data.validators")

let data = {
	"_id": "60a896e2ad16052b2d774054",
	"name": "Login",
	"request": {
		"body": {
			"password": "thisismysecret",
			"username": "jerry@appveen.com"
		},
		"headers": {
			"content-type": "application/json; charset=utf-8"
		},
		"method": "POST",
		"responseCode": 200,
		"uri": "/api/a/rbac/login"
	},
	"url": "https://staging.appveen.com"
}

async function init() {
	try {
		const options = {
			url: `${data.url}${data.request.uri}`,
			method: data.request.method,
			searchParams: data.request.params,
			headers: data.request.headers,
		};
		if (validator.whatIsThis(data.request.body) == 1 || validator.whatIsThis(data.request.body) == 2) options["json"] = data.request.body
		else options["body"] = data.request.body
		console.log(options)
		// if (_payload.request.body) options['body'] = _payload.request.body;
		response = await got(options);
		console.log(response.statusCode)
		console.log(response.body)
	} catch (error) {
		console.log(error)
	}
}

init()