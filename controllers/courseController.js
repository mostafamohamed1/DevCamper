const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const CourseModel = require('../models/CourseModel');
const BootcampModel = require('../models/BootcampModel');

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  public
exports.getCourses = catchAsync(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await CourseModel.find({
			bootcamp: req.params.bootcampId,
		});
		return res.status(200).json({
			success: true,
			result: courses.length,
			data: {
				courses,
			},
		});
	} else {
		return res.status(200).json(res.advancedResults);
	}
});

// @desc    Get single courses
// @route   GET /api/v1/courses/:id
// @access  public
exports.getCourse = catchAsync(async (req, res, next) => {
	const course = await CourseModel.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!course)
		return next(new AppError(`No course with the id of ${req.params.id}`, 404));

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = catchAsync(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await BootcampModel.findById(req.params.bootcampId);

	if (!bootcamp)
		return next(
			new AppError(`No bootcamp with the id of ${req.params.bootcampId}`, 404)
		);

	const course = await CourseModel.create(req.body);

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});

// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = catchAsync(async (req, res, next) => {
	console.log('COURSE');
	let course = await CourseModel.findById(req.params.id);
	console.log(course);

	if (course === undefined)
		return next(new AppError(`No course with the id of ${req.params.id}`, 404));

	course.update(req.body);

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = catchAsync(async (req, res, next) => {
	const course = await CourseModel.findById(req.params.id);

	if (!course)
		return next(new AppError(`No course with the id of ${req.params.id}`, 404));

	await course.remove();

	res.status(200).json({
		success: true,
		data: null,
	});
});
