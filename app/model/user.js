const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueString = require("unique-string");

const userSchema = mongoose.Schema({
	name: { type: String, require: true },
	email: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	admin: { type: Boolean, default: false },
	remember_token: {type: String, default: null}
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'user',
});

userSchema.pre("save", function(next) {
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(this.password, salt);

	this.password = hash;
	next();
})

userSchema.methods.comparePassword = function (password){
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.setRememberToken = function (res) {
	const token = uniqueString();
	res.cookie("remember_token", token, {maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true, signed: true});
	this.updateOne({remember_token: token}, err => {
		if(err) console.log(err);
	})
}

module.exports = mongoose.model("User", userSchema);