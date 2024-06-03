var express = require('express');
var router = express.Router();
var postRouter = require('./post');
var authRouter = require('./auth')
var commentRouter = require('./comment')
var userRouter = require('./users');
var authenticateToken = require('./../middleware/authMiddleware')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.use('/posts',  postRouter);
router.use('/users', userRouter);
router.use('/comments', commentRouter);
router.use('/auth', authRouter);

module.exports = router;
