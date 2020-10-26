const autoBind = require("auto-bind");
var Recaptcha = require('express-recaptcha').RecaptchaV2;

module.exports =  class Controller {
    constructor() {
        autoBind(this);
        this.recaptchaGenerator();
    }

    recaptchaGenerator() {
        this.recaptcha = new Recaptcha(
            '6LdPMtsZAAAAAKE-Txf2GYOyvxkCZ1NoAuq59UDW',
            '6LdPMtsZAAAAAImnX6cZLBwivOQZPsnZkqVTSyt6',
            { h1: 'fa' }
        );
    }

    recaptchaValidation(req, res) {
        return new Promise((resolve, reject) => {
           this.recaptcha.verify(req, (err, data) => {
               if(!err){
                   resolve(true);
               }else {
                   req.flash("errors", "please fill the recaptcha correctlly!!");
                   res.redirect(req.url);
               }
           }) 
        })
    }
}