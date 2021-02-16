const Controller = require("app/http/controller/controller");
const Course = require('app/model/Course');
const Comment = require('app/model/Comment');

class HomeController extends Controller{
	async index(req, res) {
		const courses = await Course.find({}).sort({ createdAt: 1 }).limit(8).exec();
		res.render("home/", {title: "Home", courses});
	}

	about(req, res) {
		res.render("home/about", {title: 'aboutme'});
	}

	async comment(req, res, next) {
		try{
			const status = await this.validateData(req);
			if(! status) this.back(req, res);

			const newComment  = new Comment({
				user: req.user.id,
				...req.body
			});

			await newComment.save();

			return this.back(req, res);
		}catch(err){
			next(err);
		}
	}

	test(req, res, next) {
	}
}

module.exports = new HomeController();