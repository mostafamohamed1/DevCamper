const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const UserModel = require('../models/UserModel');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin

exports.getUsers = catchAsync(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin

exports.getUser = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.params.id);

	if (!user) {
		return next(`The user with id of ${req.params.id} is not found.`, 404);
	}

	res.status(200).json({
		success: true,
		data: {
			user,
		},
	});
});

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin

exports.createUser = catchAsync(async (req, res, next) => {
	const user = await UserModel.create(req.body);

	res.status(201).json({
		success: true,
		data: {
			user,
		},
	});
});

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin

exports.updateUser = catchAsync(async (req, res, next) => {
	const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: {
			user,
		},
	});
});

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin

exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.params.id);

	if (!user) {
		return next(
			new AppError(`The user with id of ${req.params.id} not found.`)
		);
	}

	await user.remove();

	res.status(200).json({
		success: true,
		data: {
			user,
		},
	});
});
