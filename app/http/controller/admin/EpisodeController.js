const Controller = require('../controller');
const Episode = require('app/model/Episode');

class EpisodeController extends Controller {
    async index(req, res, next) {
        const episodes = await Episode.paginate({}, {limit: 10});
        res.render('admin/episodes/index', {title: 'قسمت ها', episodes})
    }
}

module.exports = new EpisodeController();