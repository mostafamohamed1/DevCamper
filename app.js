const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./middleware/error');
const bootcampRouter = require('./routes/bootcapmsRoutes');

const app = express();

// Developmet logger middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);

// Handle error
app.use(errorHandler);

module.exports = app;
