const path = require('path');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const cors = require('cors');

const bootcampRouter = require('./routes/bootcapmsRoutes');
const courseRouter = require('./routes/coursesRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/error');

const app = express();

// Body Parser
app.use(express.json({ limit: '10kb' }));

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Prevent SQL Injection
app.use(mongoSanitize());

// Header security
app.use(helmet());

// XSS protection
app.use(xss());

// Rate limiting
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// param pollution
app.use(hpp());

// Enable Cors
app.use(cors());

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handle error
app.use(errorHandler);

module.exports = app;
