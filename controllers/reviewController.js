const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const ReviewModel = require('../models/ReviewModel');
const BootcampModel = require('../models/BootcampModel');

// @desc    Get review
// @route   GET /api/v1/review
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  public
exports.getReviews = catchAsync(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await ReviewModel.find({
			bootcamp: req.params.bootcampId,
		});
		return res.status(200).json({
			success: true,
			result: reviews.length,
			data: {
				reviews,
			},
		});
	} else {
		return res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single review
// @route   GET /api/v1/review/:id
// @access  public
exports.getReview = catchAsync(async (req, res, next) => {
	const review = await ReviewModel.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!review) {
		return next(new AppError(`No review with id of ${req.params.id}`, 404));
	}

	res.status(200).json({
		success: true,
		data: {
			review,
		},
	});
});

// @desc    Add review
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  private
exports.addReview = catchAsync(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await BootcampModel.findById(req.params.bootcampId);

	if (!bootcamp)
		return next(
			new AppError(`No bootcamp with the id of ${req.params.bootcampId}`, 404)
		);

	const review = await ReviewModel.create(req.body);

	res.status(201).json({
		success: true,
		data: {
			review,
		},
	});
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  private
exports.updateReview = catchAsync(async (req, res, next) => {
	const userReview = (
		await ReviewModel.findById(req.params.id)
	).user.toString();

	if (userReview !== req.user.id && req.user.role !== 'admin') {
		return next(new AppError("You can't update edit this review", 403));
	}

	const review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!review) {
		return next(new AppError(`No review with id of ${req.params.id}`, 404));
	}

	res.status(200).json({
		success: true,
		data: {
			review,
		},
	});
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  private
exports.deleteReview = catchAsync(async (req, res, next) => {
	const userReview = (
		await ReviewModel.findById(req.params.id)
	).user.toString();

	if (userReview !== req.user.id && req.user.role !== 'admin') {
		return next(new AppError("You can't update edit this review", 403));
	}

	const review = await ReviewModel.findById(req.params.id);

	if (!review) {
		return next(new AppError(`No review with id of ${req.params.id}`, 404));
	}

	await review.remove();
	res.status(200).json({
		success: true,
		data: null,
	});
});
