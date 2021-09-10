const BootcampModel = require('../models/BootcampModel');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootCamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampModel.find();
    res.status(200).json({
      success: true,
      result: bootcamps.length,
      data: {
        bootcamps,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootCamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findById(req.params.id);

    if (!bootcamp) throw Error('There is no bootcamp with this id.');

    res.status(200).json({
      success: true,
      data: {
        bootcamp,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const updatedBootcamp = await BootcampModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBootcamp)
      throw Error('There is no Bootcamp with this id to update it.');

    res.status(201).json({
      success: true,
      data: {
        updatedBootcamp,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({
      success: true,
      data: {
        bootcamp,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    await BootcampModel.findByIdAndDelete(req.params.id);

    // res.status(204);
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
