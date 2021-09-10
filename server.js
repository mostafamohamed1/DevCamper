const colors = require('colors');
const app = require('./app');
const connectDB = require('./config/db');

// Connect to DataBase
connectDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV}, mode on port ${PORT}`.bgBlue
      .bold
  )
);

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR NAME: ${err.name} | ERROR MESSAGE: ${err.message}`.bgRed);
  server.close(process.exit(1));
});
