const express = require('express');
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courseController');
const CourseModel = require('../models/courseModel');
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
	.post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
