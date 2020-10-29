const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, unique, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, default: false },
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

module.exports = mongoose.model("User", userSchema);