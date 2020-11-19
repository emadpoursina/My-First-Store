const autoBind = require("auto-bind");

class Validator {
    constructor() {
        autoBind(this);
    }
}