const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const bootcampRouter = require('./routes/bootcapmsRoutes');
const courseRouter = require('./routes/coursesRoute');
const errorHandler = require('./middleware/error');

const app = express();

// Developmet logger middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

//set public as static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(express.json());

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle error
app.use(errorHandler);

module.exports = app;
