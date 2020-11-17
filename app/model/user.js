const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const uniqueString = require("unique-string");

const userSchema = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, default: false },
    remember_token: {type: String, default: null}
}, {
    timestamps: true
});

userSchema.pre("save", function(next) {
    bcrypt.hash(this.password, bcrypt.genSaltSync(15), (err, hash) => {
        if(err) console.log(err);
        this.password = hash;
        next();
    })
})

userSchema.methods.comparePassword = function (password){
    return bcrypt.compareSync(this.password, password);
}

userSchema.methods.setRememberToken = function (res) {
    const token = uniqueString();
    res.cookie("remember_token", token, {maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true, signed: true});
    this.updateOne({remember_token: token}, err => {
        if(err) console.log(err);
    })
}
module.exports = mongoose.model("User", userSchema);