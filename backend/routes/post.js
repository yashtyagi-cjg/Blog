var express = require('express');
var router = express.Router();
const postController = require('./../controller/postController');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id/comments', postController.addCommentToPost);


module.exports = router;