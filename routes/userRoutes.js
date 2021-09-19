const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/userController');
const advancedResults = require('../middleware/advancedResults');
const UserModel = require('../models/UserModel');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.route('/').get(advancedResults(UserModel), getUsers).post(createUser);
module.exports = router;
