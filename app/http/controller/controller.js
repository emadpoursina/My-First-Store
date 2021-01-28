const autoBind = require("auto-bind");
const config = require("../../../config");
var Recaptcha = require('express-recaptcha').RecaptchaV2;
const { validationResult } = require("express-validator/check");
const isMongoId = require("validator/lib/isMongoId");

module.exports =  class Controller {
	constructor() {
		autoBind(this);
		this.recaptchaGenerator();
	}

	recaptchaGenerator() {
		this.recaptcha = new Recaptcha(
			config.service.recaptcha.client_key,
			config.service.recaptcha.secret_key,
			config.service.recaptcha.options
		);
	}

	recaptchaValidation(req, res) {
		return new Promise((resolve, reject) => {
			this.recaptcha.verify(req, (err, data) => {
				if(!err){
					resolve(true);
				}else {
					req.flash("errors", "ریکپچا را به درستی وارد کنید");
					this.back(req, res);
				}
			}); 
		});
	}

	validateData(req) {
		const errors = validationResult(req);
		if(! errors.isEmpty()){
			let message = [];

			errors.array().forEach(error => {
				message.push(error.msg);
			});

			req.flash("errors", message);
			return false;
		}
		return true;
	}

	back(req, res) {
		req.flash("formdata", req.body);
		return res.redirect(req.header("Referer") || "/");
	}

	isMongoId(mongoId) {
		if(! isMongoId(mongoId)) {
			this.error("Invalid Id", 404);
		}
	}

	error(message, statusCode) {
		const err = new Error(message);
		err.statusCode = statusCode;
		throw err;
	} 
}