const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const UserModel = require('../models/UserModel');

// Get token from model, create cookie and send response
const sendTokenResponse = (res, statusCode, user) => {
	// Create token
	const token = user.getSignedJWTToken();

	// Options
	const option = {
		expires: new Date(
			Date.now + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000
		),
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
