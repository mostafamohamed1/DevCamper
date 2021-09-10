const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const bootcampRouter = require('./routes/bootcapmsRoutes');

//Load env VARS
dotenv.config({ path: './config/config.env' });

const app = express();

// Developmet logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);

module.exports = app;
