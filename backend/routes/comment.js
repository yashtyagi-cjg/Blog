var express = require('express');
var router = express.Router();
const commentController = require('./../controller/commentController');


router.get('/post/:id', commentController.getCommentsForPost)
router.get('/:id', commentController.getCommnetById);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;