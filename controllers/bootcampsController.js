const path = require('path');
const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const geocoder = require('../utils/geocoder');
const BootcampModel = require('../models/BootcampModel');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootCamps = catchAsync(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootCamp = catchAsync(async (req, res, next) => {
	const bootcamp = await BootcampModel.findById(req.params.id);

	if (!bootcamp)
		return next(
			new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
		);

	res.status(200).json({
		success: true,
		data: {
			bootcamp,
		},
	});
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = catchAsync(async (req, res, next) => {
	let updatedBootcamp = await BootcampModel.findById(req.params.id);

	if (!updatedBootcamp)
		return next(
			new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
		);

	// Make sure user is bootcamp owner
	if (
		updatedBootcamp.user.toString() !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(
			new AppError(
				`User ${req.params.id}  is not authorized to update this bootcamp.`,
				401
			)
		);
	}

	updatedBootcamp = await BootcampModel.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(201).json({
		success: true,
		data: {
			updatedBootcamp,
		},
	});
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = catchAsync(async (req, res, next) => {
	// Add user to req.body
	req.body.user = req.user.id;

	// Check for published bootcamp
	const publishedBootcamp = await BootcampModel.findOne({ user: req.user.id });

	// if the user is not an admin, they can only add one bootcamp
	if (publishedBootcamp && req.user.role !== 'admin') {
		return next(
			new AppError(
				`The user with ID of ${req.user.id} has already published a bootcamp.`,
				400
			)
		);
	}

	const bootcamp = await BootcampModel.create(req.body);

	res.status(201).json({
		success: true,
		data: {
			bootcamp,
		},
	});
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = catchAsync(async (req, res, next) => {
	const deletedBootcamp = await BootcampModel.findById(req.params.id);

	if (!deletedBootcamp)
		return next(
			new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
		);

	if (
		deletedBootcamp.user.toString() !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(
			new AppError(
				`User ${req.params.id}  is not authorized to delete this bootcamp.`,
				401
			)
		);
	}

	deletedBootcamp.remove();

	res.json({ success: true, data: null });
});

// @desc    Get bootcamps within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = catchAsync(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get latitude & longitude form geocoder
	const loc = await geocoder.geocode(zipcode);
	const { latitude, longitude } = loc[0];

	// Calc radius using radians
	// Divide distance by radius of the earth
	// Earth Radius = 3960 mi / 6378 km
	const radius = distance / 3960; // mi
	const bootcamps = await BootcampModel.find({
		location: {
			$geoWithin: { $centerSphere: [[longitude, latitude], radius] },
		},
	});

	res.status(200).json({
		success: true,
		result: bootcamps.length,
		data: {
			bootcamps,
		},
	});
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = catchAsync(async (req, res, next) => {
	const bootcamp = await BootcampModel.findById(req.params.id);

	if (!bootcamp)
		return next(
			new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
		);

	// Make sure user is bootcamp owner
	if (
		updatedBootcamp.user.toString() !== req.user.id &&
		req.user.role !== 'admin'
	) {
		return next(
			new AppError(
				`User ${req.params.id}  is not authorized to update this bootcamp.`,
				401
			)
		);
	}

	if (!req.files) return next(new AppError(`please upload a photo.`, 400));

	const file = req.files.photo;
	if (!file.mimetype.startsWith('image'))
		return next(new AppError(`please upload an image file.`, 400));

	if (file.size > process.env.MAX_FILE_UPLOAD)
		return next(
			new AppError(
				`please upload an image less than ${process.env.MAX_FILE_UPLOAD}.`,
				400
			)
		);

	file.name = `photo-${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new AppError(`Problem with upload image.`, 500));
		}
		await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: {
				photo: file.name,
			},
		});
	});
});
