const Controller = require('../controller');
const Episode = require('app/model/Episode');

class EpisodeController extends Controller {
	async index(req, res) {
		const episodes = await Episode.paginate({}, {limit: 10});
		res.render('admin/episodes/index', {title: 'قسمت ها', episodes})
	}

	async create(req, res, next) {
		const courses = await require('app/model/Course').find();
		res.render('admin/episodes/create', {title: 'ساخت قسمت جدید', courses})
	}

	async store(req, res) {
		const status = this.validateData(req);
		if(!status)
			return this.back(req, res);
		const newCourse = new Episode({ ...req.body });

		await newCourse.save();
		return res.redirect('/admin/episodes');
	}

	async destroy(req, res) {
		this.isMongoId(req.params.id);

		const episode = await Episode.findOne({ _id: req.params.id });
		if(! episode)
			res.end('Invalid Id');

		episode.remove();
		return res.redirect('/admin/episodes');
	}

	async edit(req, res) {
		const episode = await Episode.findOne({ _id: req.params.id })
		const courses = await require('app/model/Course').find({});
		res.render('admin/episodes/edit', {title: 'ویرایش قسمت', episode, courses});
	}

	async update(req, res, next) {
		this.isMongoId(req.params.id);

		const episode = await Episode.findOne({ _id: req.params.id });
		if(!episode)
			this.error('قسمتی با چنین لینکی وجود ندارد', 404);

		const status = this.validateData(req);
		if(!status)
			return this.back(req, res);

		const newEpisode = await Episode.findOne({ _id: req.params.id });
		Object.keys(req.body).forEach(key => {
			if(key === 'course') {
				newEpisode.course = (req.body.course).trim();
			}
			else
				newEpisode[key] = req.body[key];
		});

		await newEpisode.save();
		res.redirect('/admin/episodes');
	}
}

module.exports = new EpisodeController();