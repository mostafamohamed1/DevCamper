const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const bootcampRouter = require('./routes/bootcapmsRoutes');
const logger = require('./middleware/logger');

//Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();
  
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/v1/bootcamps', bootcampRouter);

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV}, mode on port ${PORT}`)
);
