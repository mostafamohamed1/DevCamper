const crypto = require('crypto');

const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const sender = require('../utils/sendEmail');
const UserModel = require('../models/UserModel');

// Get token from model, create cookie and send response
const sendTokenResponse = (res, statusCode, user) => {
	// Create token
	const token = user.getSignedJWTToken();

	// Options
	const option = {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		option.secure = true;
	}

	res.cookie('token', token, option);

	user.password = undefined;

	res.status(statusCode).json({
		success: true,
		token,
	});
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private

exports.logout = catchAsync(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: null,
	});
});

// @desc    Current logged in user
// @route   GET /api/v1/auth/me
// @access  Private

exports.getMe = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.user.id);
	res.status(200).json({
		success: true,
		data: {
			user,
		},
	});
});

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  public

exports.register = catchAsync(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Create user
	const user = await UserModel.create({
		name,
		email,
		password,
		role,
	});

	sendTokenResponse(res, 200, user);
});

// @desc    Login user
// @route   POST /api/v1/auth/Login
// @access  public

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email & password
	if (!email || !password) {
		return next(new AppError('Please provide an email and password.', 400));
	}

	// Check for user
	const user = await UserModel.findOne({ email }).select('+password');
	if (!user) {
		return next(new AppError('Invalid credentials.', 401));
	}

	// Check if password is match
	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		return next(new AppError('Invalid credentials.', 401));
	}

	sendTokenResponse(res, 200, user);
});

// @desc    Forgot password
// @route   GET /api/v1/auth/forgotpassword
// @access  Private

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const user = await UserModel.findOne({ email: req.body.email });

	if (!user) {
		return next(new AppError('There is no user with that email.', 404));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create reset URL
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the rest of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
		await sender({
			email: user.email,
			subject: 'Password Reset Token..!',
			message: message,
		});
		res.status(200).json({ success: true, data: 'Email send successfully..!' });
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new AppError('Email could not be send.', 500));
	}
});

// @desc    Reset passwoed
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  public

exports.resetPassword = catchAsync(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex');
	const user = await UserModel.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new AppError('Invalid token.', 400));
	}
	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendTokenResponse(res, 200, user);
});

// @desc    Update user details
// @route   GET /api/v1/auth/updatedetails
// @access  Private

exports.updateDetails = catchAsync(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await UserModel.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
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

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private

exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.user.id).select('+password');

	// Check the current password
	if (!(await user.comparePassword(req.body.currentPassword))) {
		return next(new AppError('Password in incorrect.', 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(res, 200, user);
});
