const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, unique, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, default: false },
}, {
    timestamps: true
});



module.exports = mongoose.model("User", userSchema);