const express = require('express');

const ReviewModel = require('../models/ReviewModel');
const {
	getReviews,
	getReview,
	addReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviewController');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(ReviewModel, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getReviews
	)
	.post(protect, authorize('user', 'admin'), addReview);

router
	.route('/:id')
	.get(getReview)
	.put(protect, authorize('user', 'admin'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
