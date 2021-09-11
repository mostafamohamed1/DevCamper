const AppError = require('../utils/AppError');
const catchAsync = require('../middleware/catchAsync');
const BootcampModel = require('../models/BootcampModel');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootCamps = catchAsync(async (req, res, next) => {
  const bootcamps = await BootcampModel.find();

  res.status(200).json({
    success: true,
    result: bootcamps.length,
    data: {
      bootcamps,
    },
  });
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
  const updatedBootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedBootcamp)
    return next(
      new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
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
  const deletedBootcamp = await BootcampModel.findByIdAndDelete(req.params.id);

  if (!deletedBootcamp)
    return next(
      new AppError(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.json({ success: true, data: null });
});
