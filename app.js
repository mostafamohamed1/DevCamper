const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const bootcampRouter = require('./routes/bootcapmsRoutes');
const courseRouter = require('./routes/coursesRoutes');
const authRouter = require('./routes/authRoutes');
const errorHandler = require('./middleware/error');

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Developmet logger middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

//set public as static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle error
app.use(errorHandler);

module.exports = app;
