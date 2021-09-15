const express = require('express');

const {
	getBootCamps,
	getBootCamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcampsController');
const BootcampModel = require('../models/BootcampModel');
const advancedResult = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Include other resources routers
const courseRouter = require('./coursesRoutes');

const router = express.Router();

//Re-route into other resources routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
	.route('/')
	.get(advancedResult(BootcampModel, 'courses'), getBootCamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);
router
	.route('/:id')
	.get(getBootCamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
