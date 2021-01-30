const Controller = require('../controller');
const Episode = require('app/model/Episode');
const Course = require('app/model/Course');

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

		const newEpisode = new Episode({ ...req.body });
		await newEpisode.save();

		// Update course time
		this.updateCourseTime(req.body.course);

		return res.redirect('/admin/episodes');
	}

	async destroy(req, res) {
		this.isMongoId(req.params.id);

		const episode = await Episode.findOne({ _id: req.params.id });
		if(! episode)
			res.end('Invalid Id');

		episode.remove();

		// Update course time
		this.updateCourseTime(String(req.body.course));

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
			res.end('Invalid Id');

		const status = this.validateData(req);
		if(!status)
			return this.back(req, res);

		// Episode data in the database
		const newEpisode = await Episode.findOne({ _id: req.params.id });

		// Id of the previuse course
		const oldCourseId = newEpisode.course;

		Object.keys(req.body).forEach(key => {
			if(key === 'course') {
				newEpisode.course = (req.body.course).trim();
			}else
				newEpisode[key] = req.body[key];
		});

		await newEpisode.save();

		// Update time of the new And old course
		this.updateCourseTime(newEpisode.course);
		if(newEpisode.course != String(oldCourseId))
			this.updateCourseTime(String(oldCourseId));

		res.redirect('/admin/episodes');
	}

	// This function will update the the course time attribuite
	async updateCourseTime(courseId) {
		const course = await Course.findById(courseId);
		const episodes = await Episode.find({ course: courseId });

		course.set({ time: this.getTime(episodes)});
		
		await course.save();
	}
}

module.exports = new EpisodeController();