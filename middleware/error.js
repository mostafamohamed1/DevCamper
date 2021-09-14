const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	// Log to console for dev
	console.log('STACK', err.stack);

	// console.log(err.name);
	console.log('ENTIREERROR', err);

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = `Invalid ${err.path} of ${err.value} in Model ${
			err.stack.includes('Bootcamp') ? 'Bootcamp' : ''
		}${err.stack.includes('Course') ? 'Course' : ''}`;
		error = new AppError(message, 404);
	}

	// Mongoose duplicate key
	if (error.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new AppError(message, 400);
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new AppError(message, 400);
	}

	res.status(err.statusCode || 500).json({
		success: false,
		message: error.message || 'Server Error.',
	});
};

module.exports = errorHandler;
