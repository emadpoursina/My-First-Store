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

	/**
	 * @param {String} mongoId 
	 * Return Boolean
	 * Check if mongoId is valid
	 */
	isMongoId(mongoId) {
		if(! isMongoId(mongoId)) {
			this.error("Invalid Id", 403);
		}
	}

	/**
	 * Error thrower 
	 */
	error(message, statusCode) {
		const err = new Error(message);
		err.statusCode = statusCode;
		throw err;
	} 

	/**
	 * Returns total length of the episodes in sec
	 * @param {Episode[]} episodes 
	 */
	getTime(episodes){
		let sec = 0;
		episodes.forEach(episode => {
			const times = episode.time.split(':');

			// Convert time parts to int
			for(let i = 0; i < times.length ; i++) {
				times[i] = +times[i];
			}

			sec += times[times.length-1];
			if(times.length >= 2)
				sec += times[times.length-2] * 60;
			if(times.length === 3)
				sec += times[times.length-3] * 3600;

		});
			// Seconds to HH:MM:SS
			return String(Math.floor(sec/3600)) + ':' + String(Math.floor((sec%3600)/60)) + ':' + Math.floor((sec%3600)%60);
	}

	 // Return an option array for multiple select
	 /**
		* 
		* An array of items should go make options from
		* @param {Array} items
		* The item attribute that appear on the lable of select
		* @param {String} labelFieldName 
		* The item attribute that appear on the value of select
		* @param {String} valueFieldName 
		* If true return an string in json format else return an object
		* @param {boolean} json 
		*/
	makeOptions(items, labelFieldName, valueFieldName, json=false) {
    const options = [];
    items.forEach(item => {
      options.push({
        label: item[labelFieldName],
        value: item[valueFieldName],
      });
    });
		if(!json)
			return options;
		else
			return JSON.stringify(options);
	}

	sweetAlert(req, alertInfo) {
		req.flash('sweetAlert', alertInfo);
	}
}