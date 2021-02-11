const Controller = require('./../controller');
const Comment = require('app/model/Comment');

class CommentController extends Controller {
  async approved(req, res, next) {
    try {
      const page = req.query.page | 1;
      const comments = await Comment.paginate({ approved: false}, {
        page,
        limit: 20,
        sort: { createdAt: -1 },
        populate: [{
          path: 'user',
          select: 'name',
        },{
          path: 'course',
        },{
          path: 'episode',
          populate: [{
            path: 'course',
          }]
        }]
      });
      res.render('admin/comment/index', { title: 'تایید نشده', comments, approved: true });
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const comment = await Comment.findById(req.params.id);
      if(!comment) this.error('چنین کامنتی وجود ندارد.', 404);

      comment['approved'] = true;

      await comment.save();

      return this.back(req, res);
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      const page = req.query.page | 1;
      const comments = await Comment.paginate({}, {
        page,
        limit: 10,
        sort: { createdAt: -1 },
        populate: [{
          path: 'user',
          select: 'name',
        },{
          path: 'course',
        },{
          path: 'episode',
          populate: [{
            path: 'course',
          }]
        }]
      });
      res.render('admin/comment/index', { title: 'comments', comments, approved: false});
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      this.isMongoId(req.params.id);

      const comment = await Comment.findById(req.params.id);
      if(!comment) this.error('چنیین کامنتی وجود ندارد!', 404);

      await comment.remove();

      return this.back(req, res);
    } catch (error) {
      next( error);
    }
  }
}

module.exports = new CommentController();