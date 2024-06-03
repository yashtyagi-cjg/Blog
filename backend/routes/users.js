var express = require('express');
var router = express.Router();
const userController = require('./../controller/userController');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;