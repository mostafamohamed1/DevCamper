const express = require('express');
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const CourseModel = require('../models/CourseModel');
const advancedResult = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResult(CourseModel, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(protect, authorize('publisher', 'admin'), addCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(protect, authorize('publisher', 'admin'), updateCourse)
	.delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
