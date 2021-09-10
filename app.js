const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

//Load env vars
dotenv.config({ path: './config/config.env' });

const bootcampRouter = require('./routes/bootcapmsRoutes');
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);

module.exports = app;
