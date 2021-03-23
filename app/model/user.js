const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueString = require("unique-string");
const mogoosePaginate = require('mongoose-paginate');

const userSchema = Schema({
	name: { type: String, require: true },
	email: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	admin: { type: Boolean, default: false },
	remember_token: {type: String, default: null},
	vipTime: { type: Date, required: true, default: new Date().toISOString() },
	vipType: { type: String, required: true, default: 'month' },
	learning: [{ type: Schema.Types.ObjectId, default: [], ref: 'Course'}],
	roles: [{ type: Schema.Types.ObjectId, default: [], ref: 'Role'}],
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

userSchema.plugin(mogoosePaginate);

userSchema.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'user',
});

userSchema.methods.hasRole = function(roles) {
	const a = roles.filter(role => {
		return this.roles.indexOf(role) > -1;
	});

	return !! a.length;
}

userSchema.pre("save", function(next) {
	const salt = bcrypt.genSaltSync(15);
	const hash = bcrypt.hashSync(this.password, salt);

	this.password = hash;
	next();
});

userSchema.methods.comparePassword = function (password){
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.setRememberToken = function (res) {
	const token = uniqueString();
	res.cookie("remember_token", token, {maxAge: 1000 * 60 * 60 * 24 * 3, httpOnly: true, signed: true});
	this.updateOne({remember_token: token}, err => {
		if(err) console.log(err);
	});
}

/*
 * Check whether user is vip or not
 */
userSchema.methods.isVip = function () {
	return false;
}

/*
 * Check whether user buy a course of not
 */
userSchema.methods.checkLearning = function(courseId) {
	return !! this.learning.includes(courseId);
}

module.exports = mongoose.model("User", userSchema);