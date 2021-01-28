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
        if(!status) {
            this.back(req, res);
        }

        const newCourse = new Episode({ ...req.body });

        await newCourse.save();
        return res.redirect('/admin/episodes');
    }
}

module.exports = new EpisodeController();