const mongoose = require("mongoose");

const passowrdResetSchema = mongoose.Schema({
    email: { type: String, require: true},
    token: { type: String, require: true},
    use: { type: Boolean, default: false}
}, { timeStamps: { updateAt: false }});

module.exports = mongoose.model("PasswordReset", passowrdResetSchema);