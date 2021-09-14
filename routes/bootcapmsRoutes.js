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

// Include other resources routers
const courseRouter = require('./coursesRoute');

const router = express.Router();

//Re-route into other resources routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
	.route('/')
	.get(advancedResult(BootcampModel, 'courses'), getBootCamps)
	.post(createBootcamp);
router
	.route('/:id')
	.get(getBootCamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
