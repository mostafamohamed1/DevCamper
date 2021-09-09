const express = require('express');

const {
  getBootCamps,
  getBootCamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require('../controller/bootcampsController');

const router = express.Router();

router.route('/').get(getBootCamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootCamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
