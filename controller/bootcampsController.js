// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @desc    Get bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamps' });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
