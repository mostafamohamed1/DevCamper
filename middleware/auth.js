const jwt = require('jsonwebtoken');
const catchAsync = require('./catchAsync');
const AppError = require('../utils/AppError');
const UserModel = require('../models/UserModel');

// Protect routes
exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return next(new AppError('Not authorized to access this route.', 401));
	}
	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = await UserModel.findById(decoded.id);
		next();
	} catch (err) {
		return next(new AppError('Not authorized to access this route.', 401));
	}
});

// Grant access to specific role
exports.authorize = (...role) => {
	return (req, res, next) => {
		if (!role.includes(req.user.role)) {
			return next(
				new AppError(
					`User role ${req.user.role} is unauthorized to access this action`,
					403
				)
			);
		}
		next();
	};
};
